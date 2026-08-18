#!/usr/bin/env python3
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import json
import urllib.parse
import urllib.request
import yfinance as yf
import traceback
import sys
import ssl
import time
import threading
import pandas as pd

# Bypass macOS Python SSL certificate verification issues
ssl._create_default_https_context = ssl._create_unverified_context

PRICE_CACHE = {}
CACHE_TIMESTAMP = 0
CACHE_LOCK = threading.Lock()

class StockHandler(SimpleHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(204)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        global PRICE_CACHE, CACHE_TIMESTAMP
        # 1. BULK LIVE PRICES ENDPOINT
        if self.path.startswith('/api/bulk-prices?tickers='):
            tickers_str = urllib.parse.unquote(self.path.split('=')[1])
            ticker_list = [t.strip().upper() for t in tickers_str.split(',') if t.strip()]
            try:
                now = time.time()
                # Return cached prices instantly if fresh (under 2 minutes old)
                with CACHE_LOCK:
                    if PRICE_CACHE and (now - CACHE_TIMESTAMP < 120):
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self._send_cors_headers()
                        self.end_headers()
                        self.wfile.write(json.dumps(PRICE_CACHE).encode())
                        return

                # Download new prices
                data = yf.download(ticker_list, period='5d', progress=False)
                prices = {}

                if not data.empty and 'Close' in data.columns:
                    close_data = data['Close']
                    for t in ticker_list:
                        try:
                            series = close_data if len(ticker_list) == 1 else close_data[t]
                            series = series.dropna()
                            if len(series) > 0:
                                prices[t] = {"price": round(float(series.iloc[-1]), 2), "yearChange": None}
                        except Exception:
                            pass

                # Fallback: fetch individually for any missing tickers
                for t in ticker_list:
                    if t not in prices:
                        try:
                            s = yf.Ticker(t)
                            inf = s.info
                            p = inf.get("currentPrice", inf.get("regularMarketPrice", inf.get("previousClose", 0)))
                            if p and p > 0:
                                prices[t] = {"price": round(float(p), 2), "yearChange": None}
                        except Exception:
                            pass

                if prices:
                    with CACHE_LOCK:
                        PRICE_CACHE.update(prices)
                        CACHE_TIMESTAMP = now

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(PRICE_CACHE or prices).encode())
            except Exception as e:
                traceback.print_exc()
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
            return

        # 2. GLOBAL SEARCH ENDPOINT
        if self.path.startswith('/api/search?q='):
            query = urllib.parse.unquote(self.path.split('=')[1])
            try:
                search_url = f"https://query2.finance.yahoo.com/v1/finance/search?q={urllib.parse.quote(query)}&quotesCount=1"
                req = urllib.request.Request(search_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(req) as response:
                    search_data = json.loads(response.read().decode())

                quotes = search_data.get('quotes', [])
                if not quotes:
                    self.send_response(404)
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Stock not found"}).encode())
                    return

                best_match = quotes[0]
                ticker_symbol = best_match.get('symbol')
                company_name = best_match.get('shortname', best_match.get('longname', query))

                stock = yf.Ticker(ticker_symbol)
                info = stock.info

                price = info.get("currentPrice", info.get("regularMarketPrice", 0))
                if price == 0:
                    price = info.get("previousClose", 0)

                target = info.get("targetMeanPrice", 0)
                verdict = "Hold"
                if target and price:
                    upside = (target - price) / price
                    if upside > 0.15: verdict = "Strong Buy"
                    elif upside > 0.05: verdict = "Buy"
                    elif upside < -0.05: verdict = "Sell"

                reason = info.get("longBusinessSummary", "Global stock found via Live Search. No detailed summary available.")
                if len(reason) > 100:
                    reason = reason[:97] + "..."

                verdict_class = "verdict-hold"
                if "Strong" in verdict: verdict_class = "verdict-strong-buy"
                elif "Buy" in verdict: verdict_class = "verdict-buy"
                elif "Sell" in verdict: verdict_class = "verdict-sell"

                # ── EARNINGS TABLE + BEAT STREAK ──────────────────────────────
                earnings_list = []
                earnings_beat_streak = 0
                try:
                    df = stock.earnings_dates
                    if df is not None and not df.empty:
                        df = df.reset_index()
                        df['DateStr'] = df['Earnings Date'].dt.strftime('%Y-%m-%d')
                        df_sorted = df.sort_values('Earnings Date', ascending=False)
                        for _, row in df_sorted.iterrows():
                            act = row.get('Reported EPS')
                            surp = row.get('Surprise(%)')
                            if pd.isna(act) or act is None:
                                continue
                            if not pd.isna(surp) and surp is not None and float(surp) > 0:
                                earnings_beat_streak += 1
                            else:
                                break
                        for _, row in df.head(6).iterrows():
                            est = row['EPS Estimate']
                            act = row['Reported EPS']
                            surp = row['Surprise(%)']
                            earnings_list.append({
                                "date": row['DateStr'],
                                "est": float(est) if not pd.isna(est) else None,
                                "act": float(act) if not pd.isna(act) else None,
                                "surprise": float(surp) if not pd.isna(surp) else None
                            })
                except Exception as e:
                    print("Earnings dates error:", e)

                # ── HISTORICAL DATA + SMA + CROSS + FEAR/GREED + FIBONACCI ────
                hist_dates = []
                hist_prices = []
                sma50 = None
                sma200 = None
                cross_signal = None
                fear_greed_score = 50
                fib_high = None
                fib_low = None
                rsi_dates = []
                rsi_values = []
                macd_dates = []
                macd_values = []
                macd_signal_line = []
                macd_histogram = []
                try:
                    hist_df = stock.history(period="1y")
                    if not hist_df.empty:
                        hist_dates = [d.strftime('%Y-%m-%d') for d in hist_df.index]
                        hist_prices = [round(float(p), 2) for p in hist_df['Close']]
                        closes = hist_df['Close']
                        fib_high = round(float(closes.max()), 2)
                        fib_low = round(float(closes.min()), 2)
                        if len(closes) >= 50:
                            sma50 = round(float(closes.iloc[-50:].mean()), 2)
                        if len(closes) >= 200:
                            sma200 = round(float(closes.iloc[-200:].mean()), 2)
                        elif len(closes) >= 100:
                            sma200 = round(float(closes.mean()), 2)
                        if sma50 and sma200:
                            cross_signal = "golden" if sma50 > sma200 else "death"
                        # RSI-based Fear & Greed
                        if len(closes) >= 15:
                            delta = closes.diff()
                            gain = delta.where(delta > 0, 0).rolling(14).mean()
                            loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
                            rs = gain / loss
                            rsi_series = 100 - (100 / (1 + rs))
                            fear_greed_score = round(float(rsi_series.iloc[-1]))
                        # RSI chart data (last 60 points)
                        if len(rsi_series.dropna()) > 0:
                            rsi_clean = rsi_series.dropna().iloc[-60:]
                            rsi_dates = [d.strftime('%Y-%m-%d') for d in rsi_clean.index]
                            rsi_values = [round(float(v), 2) for v in rsi_clean.values]
                        # MACD chart data
                        ema12 = closes.ewm(span=12, adjust=False).mean()
                        ema26 = closes.ewm(span=26, adjust=False).mean()
                        macd_line = ema12 - ema26
                        signal_line = macd_line.ewm(span=9, adjust=False).mean()
                        histogram = macd_line - signal_line
                        macd_clean = macd_line.dropna().iloc[-60:]
                        signal_clean = signal_line.dropna().iloc[-60:]
                        hist_clean = histogram.dropna().iloc[-60:]
                        macd_dates = [d.strftime('%Y-%m-%d') for d in macd_clean.index]
                        macd_values = [round(float(v), 2) for v in macd_clean.values]
                        macd_signal_line = [round(float(v), 2) for v in signal_clean.values]
                        macd_histogram = [round(float(v), 2) for v in hist_clean.values]
                except Exception as e:
                    print("History error:", e)
                    try:
                        hist_df = stock.history(period="6mo")
                        if not hist_df.empty:
                            hist_dates = [d.strftime('%Y-%m-%d') for d in hist_df.index]
                            hist_prices = [round(float(p), 2) for p in hist_df['Close']]
                    except:
                        pass

                # ── RECENT NEWS ───────────────────────────────────────────────
                news_list = []
                try:
                    raw_news = stock.news
                    if raw_news:
                        for n in raw_news[:3]:
                            news_list.append({
                                "title": n.get("title", ""),
                                "link": n.get("link", ""),
                                "publisher": n.get("publisher", "")
                            })
                except Exception as e:
                    print("News error:", e)

                # ── TOP INSTITUTIONAL HOLDERS ──────────────────────────────────
                top_investors = []
                try:
                    inst_holders = stock.institutional_holders
                    if inst_holders is not None and not inst_holders.empty:
                        for _, row in inst_holders.head(3).iterrows():
                            holder = row.get('Holder', 'Unknown')
                            shares = row.get('Shares', 0)
                            if isinstance(shares, (int, float)):
                                if shares > 1_000_000_000:
                                    shares_str = f"{shares/1_000_000_000:.1f}B"
                                elif shares > 1_000_000:
                                    shares_str = f"{shares/1_000_000:.1f}M"
                                else:
                                    shares_str = str(int(shares))
                            else:
                                shares_str = str(shares)
                            top_investors.append(f"{holder} ({shares_str} shares)")
                except Exception:
                    pass

                # ── INSIDER TRANSACTIONS ──────────────────────────────────────
                insider_trades = []
                try:
                    insider_df = stock.insider_transactions
                    if insider_df is not None and not insider_df.empty:
                        for _, row in insider_df.head(5).iterrows():
                            shares_val = row.get('Shares', 0)
                            value_val = row.get('Value', 0)
                            text_val = str(row.get('Text', ''))
                            name_val = str(row.get('Name', 'Unknown'))
                            start_date = row.get('Start Date', '')
                            try:
                                date_str = pd.Timestamp(start_date).strftime('%Y-%m-%d')
                            except:
                                date_str = str(start_date)[:10]
                            is_buy = 'Purchase' in text_val or 'Buy' in text_val
                            insider_trades.append({
                                "name": name_val,
                                "date": date_str,
                                "shares": int(shares_val) if isinstance(shares_val, (int, float)) and not pd.isna(shares_val) else 0,
                                "value": int(value_val) if isinstance(value_val, (int, float)) and not pd.isna(value_val) else 0,
                                "isBuy": is_buy
                            })
                except Exception as e:
                    print("Insider error:", e)

                # ── MAGIC FORMULA SCORE (Greenblatt) ──────────────────────────
                magic_formula_score = None
                try:
                    ebit = info.get('ebitda')
                    market_cap = info.get('marketCap')
                    total_debt_mf = info.get('totalDebt', 0) or 0
                    total_cash_mf = info.get('totalCash', 0) or 0
                    net_fixed_assets = info.get('totalAssets', 0) or 0
                    current_assets = info.get('currentAssets', 0) or 0
                    current_liab = info.get('currentLiabilities', 0) or 0
                    if ebit and market_cap and market_cap > 0 and ebit > 0:
                        ev = market_cap + total_debt_mf - total_cash_mf
                        earnings_yield = (ebit / ev) * 100 if ev > 0 else 0
                        invested_capital = net_fixed_assets + (current_assets - current_liab)
                        roc = (ebit / invested_capital) * 100 if invested_capital > 0 else 0
                        raw_score = (earnings_yield * 0.5) + (roc * 0.5)
                        magic_formula_score = min(100, max(0, round(raw_score)))
                except Exception as e:
                    print("Magic formula error:", e)

                # ── 52-WEEK CHANGE ─────────────────────────────────────────────
                year_change_raw = info.get('52WeekChange')
                year_change = None
                if year_change_raw is not None:
                    year_change = f"{year_change_raw * 100:+.2f}%"

                # ── NEXT EARNINGS DATE ─────────────────────────────────────────
                next_earnings_date = None
                try:
                    cal = stock.calendar
                    if cal is not None:
                        if isinstance(cal, dict):
                            ed = cal.get('Earnings Date')
                            if ed:
                                if isinstance(ed, list) and len(ed) > 0:
                                    next_earnings_date = pd.Timestamp(ed[0]).strftime('%Y-%m-%d')
                                else:
                                    next_earnings_date = pd.Timestamp(ed).strftime('%Y-%m-%d')
                        elif isinstance(cal, pd.DataFrame) and not cal.empty:
                            next_earnings_date = pd.Timestamp(cal.index[0]).strftime('%Y-%m-%d')
                except Exception as e:
                    print("Earnings calendar error:", e)

                # ── PRICE TARGET UPSIDE ────────────────────────────────────────
                target_upside = None
                if target and price and price > 0:
                    target_upside = round(((target - price) / price) * 100, 1)

                data = {
                    "ticker": ticker_symbol,
                    "name": company_name,
                    "price": f"${price:.2f}" if price else "N/A",
                    "verdict": verdict,
                    "reason": reason,
                    "class": verdict_class,
                    "delay": "0s",
                    "rawPrice": price,
                    "yearChange": year_change,
                    "topInvestors": top_investors,
                    "insiderTrades": insider_trades,
                    "earningsBeatStreak": earnings_beat_streak,
                    "magicFormulaScore": magic_formula_score,
                    "sma50": sma50,
                    "sma200": sma200,
                    "crossSignal": cross_signal,
                    "fearGreedScore": fear_greed_score,
                    "fibHigh": fib_high,
                    "fibLow": fib_low,
                    "targetUpside": target_upside,
                    # Financials
                    "roe": info.get("returnOnEquity"),
                    "forwardPE": info.get("forwardPE"),
                    "debtToEquity": info.get("debtToEquity"),
                    "revenueGrowth": info.get("revenueGrowth"),
                    "shortInterest": info.get("shortPercentOfFloat"),
                    "targetPrice": target,
                    "eps": info.get("trailingEps"),
                    "bookValue": info.get("bookValue"),
                    "earningsTable": earnings_list,
                    "historyDates": hist_dates,
                    "historyPrices": hist_prices,
                    "news": news_list,
                    "freeCashflow": info.get("freeCashflow"),
                    "totalDebt": info.get("totalDebt"),
                    "totalRevenue": info.get("totalRevenue"),
                    "grossMargins": info.get("grossMargins"),
                    "profitMargins": info.get("profitMargins"),
                    "currentRatio": info.get("currentRatio"),
                    "totalCash": info.get("totalCash"),
                    "rsiDates": rsi_dates,
                    "rsiValues": rsi_values,
                    "macdDates": macd_dates,
                    "macdValues": macd_values,
                    "macdSignal": macd_signal_line,
                    "macdHistogram": macd_histogram,
                    "nextEarningsDate": next_earnings_date,
                    "fiftyTwoWeekHigh": info.get('fiftyTwoWeekHigh'),
                    "fiftyTwoWeekLow": info.get('fiftyTwoWeekLow'),
                    "earningsGrowth": info.get('earningsGrowth'),
                    "marketCap": info.get('marketCap'),
                    "operatingCashflow": info.get("operatingCashflow")
                }

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(data).encode())
            except Exception as e:
                traceback.print_exc()
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
            return

        # 3. CHART HISTORY ENDPOINT
        if self.path.startswith('/api/chart?'):
            parsed = urllib.parse.urlparse(self.path)
            query_params = urllib.parse.parse_qs(parsed.query)
            ticker = query_params.get('ticker', [''])[0]
            period = query_params.get('period', ['6mo'])[0]

            try:
                stock = yf.Ticker(ticker)
                interval = "1d"
                if period == "1d":
                    interval = "5m"
                elif period in ["5d", "1wk"]:
                    interval = "15m"
                elif period in ["1mo", "3mo"]:
                    interval = "1d"
                elif period in ["6mo", "ytd", "1y"]:
                    interval = "1d"
                elif period in ["2y", "5y", "10y", "max"]:
                    interval = "1wk"

                hist_df = stock.history(period=period, interval=interval)
                hist_dates = []
                hist_prices = []
                rsi_values = []

                if not hist_df.empty:
                    for d in hist_df.index:
                        if period in ["1d", "5d", "1wk"]:
                            hist_dates.append(d.strftime('%b %d, %H:%M'))
                        else:
                            hist_dates.append(d.strftime('%Y-%m-%d'))
                    hist_prices = [round(float(p), 2) for p in hist_df['Close']]
                    
                    if len(hist_df) >= 15:
                        closes = hist_df['Close']
                        delta = closes.diff()
                        gain = delta.where(delta > 0, 0).rolling(14).mean()
                        loss = (-delta.where(delta < 0, 0)).rolling(14).mean()
                        rs = gain / loss
                        rsi_series = 100 - (100 / (1 + rs))
                        rsi_values = [round(float(v), 2) if not pd.isna(v) else None for v in rsi_series]
                    else:
                        rsi_values = [None] * len(hist_prices)

                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"dates": hist_dates, "prices": hist_prices, "rsi": rsi_values}).encode())
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
            return

        # default static file serving
        super().do_GET()

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 8080))
    server = ThreadingHTTPServer(('0.0.0.0', port), StockHandler)
    print(f"Live Global Stock Server running on port {port}")
    sys.stdout.flush()
    server.serve_forever()
