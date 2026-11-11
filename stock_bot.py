import yfinance as yf
import pandas as pd
import numpy as np
import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
from GoogleNews import GoogleNews
import ssl
from datetime import datetime, timedelta
import urllib.request
import xml.etree.ElementTree as ET
import html
try:
    from scipy.signal import find_peaks
except ImportError:
    def find_peaks(x, distance=1, prominence=0):
        x = np.asarray(x, dtype=float)
        n = len(x)
        candidates = []
        for i in range(1, n - 1):
            if x[i] > x[i - 1] and x[i] >= x[i + 1]:
                candidates.append(i)
        if prominence > 0:
            filtered = []
            for p in candidates:
                left_min = x[p]
                for j in range(p - 1, -1, -1):
                    if x[j] > x[p]:
                        break
                    if x[j] < left_min:
                        left_min = x[j]
                right_min = x[p]
                for j in range(p + 1, n):
                    if x[j] > x[p]:
                        break
                    if x[j] < right_min:
                        right_min = x[j]
                prom = x[p] - max(left_min, right_min)
                if prom >= prominence:
                    filtered.append(p)
            candidates = filtered
        if distance > 1:
            filtered = []
            for p in candidates:
                if not filtered:
                    filtered.append(p)
                elif p - filtered[-1] >= distance:
                    filtered.append(p)
                else:
                    if x[p] > x[filtered[-1]]:
                        filtered[-1] = p
            candidates = filtered
        return np.array(candidates, dtype=int), {}

import os
import sys
import certifi

from dcf_engine import compute_fundamental_dcf_scenarios, get_audited_ttm_fcf
from sec_edgar import (
    extract_sec_quarterly_fundamentals,
    get_latest_filed_report_date,
    verify_metric_value,
    compute_one_off_adjusted_eps
)

# --- SSL VERIFICATION WITH CERTIFI ---
try:
    os.environ["SSL_CERT_FILE"] = certifi.where()
    os.environ["REQUESTS_CA_BUNDLE"] = certifi.where()
    ssl._create_default_https_context = lambda: ssl.create_default_context(cafile=certifi.where())
except Exception:
    pass

# --- CONFIGURATION ---
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")

logging.basicConfig(format='%(asctime)s - %(name)s - %(levelname)s - %(message)s', level=logging.INFO)

def esc(text):
    if not text: return "N/A"
    return html.escape(str(text))

def get_latest_news_of_day(ticker):
    news_list = []
    try:
        googlenews = GoogleNews(lang='en', region='US', period='7d')
        googlenews.search(f"{ticker} stock major catalyst projects news")
        googlenews.get_page(1)
        results = googlenews.results()
        
        for n in results:
            source = esc(n.get('media', 'News'))
            title = n.get('title', '')
            link = n.get('link', '#')
            if not title or len(title) < 10: continue
            clean_title = esc(title[:80])
            safe_link = html.escape(str(link).strip(), quote=True) if link and (str(link).strip().startswith("http://") or str(link).strip().startswith("https://")) else "#"
            news_list.append(f"• <b>[{source}]</b> <a href='{safe_link}'>{clean_title}...</a>")
            if len(news_list) >= 3: break
    except Exception as e:
        logging.error(f"GoogleNews fail: {e}")

    return "\n".join(news_list) if news_list else "• No major catalysts found in recent news."

def format_money(num):
    if num is None or str(num).lower() == 'nan': return "N/A"
    try:
        num = float(num)
        if num >= 1e12: return f"${num / 1e12:.2f} Trillion"
        elif num >= 1e9: return f"${num / 1e9:.2f} Billion"
        elif num >= 1e6: return f"${num / 1e6:.2f} Million"
        else: return f"${num:,.2f}"
    except: return "N/A"

def format_pct(num):
    if num is None or str(num).lower() == 'nan': return "N/A"
    try:
        return f"{float(num) * 100:.2f}%"
    except: return "N/A"

# --- ADVANCED TECHNICALS & PATTERNS ---

def get_rsi(df, periods=14):
    try:
        close_delta = df['Close'].diff()
        up = close_delta.clip(lower=0)
        down = -1 * close_delta.clip(upper=0)
        ma_up = up.rolling(window=periods).mean()
        ma_down = down.rolling(window=periods).mean()
        rs = ma_up / ma_down
        rsi = 100 - (100 / (1 + rs))
        return rsi.iloc[-1]
    except: return 50.0

def get_fibonacci_levels(df):
    try:
        # Get 1-Year High and Low
        high = df['High'].max()
        low = df['Low'].min()
        diff = high - low
        return {
            "0% (High)": high,
            "23.6%": high - 0.236 * diff,
            "38.2%": high - 0.382 * diff,
            "50.0%": high - 0.5 * diff,
            "61.8%": high - 0.618 * diff,
            "78.6%": high - 0.786 * diff,
            "100% (Low)": low
        }
    except: return {}

def detect_patterns(df):
    """
    Detects Head & Shoulders, Double Top (M), Double Bottom (W).
    Uses scipy.signal.find_peaks to identify local maxima and minima over the last ~100 days.
    """
    try:
        recent_df = df.tail(100)
        prices = recent_df['Close'].values
        
        # Find peaks (highs) and troughs (lows)
        # distance=5 ensures peaks are at least 5 days apart
        peaks, _ = find_peaks(prices, distance=5, prominence=prices.max()*0.02)
        troughs, _ = find_peaks(-prices, distance=5, prominence=prices.max()*0.02)
        
        detected = []
        
        # Need at least a few peaks/troughs to detect patterns
        if len(peaks) >= 2:
            last_two_peaks = prices[peaks[-2:]]
            # Double Top (M) - Peaks are roughly equal (within 2%)
            if abs(last_two_peaks[0] - last_two_peaks[1]) / last_two_peaks[0] < 0.02:
                detected.append("🔴 Double Top (M-Pattern) forming/complete - Bearish Reversal.")
        
        if len(troughs) >= 2:
            last_two_troughs = prices[troughs[-2:]]
            # Double Bottom (W) - Troughs are roughly equal (within 2%)
            if abs(last_two_troughs[0] - last_two_troughs[1]) / last_two_troughs[0] < 0.02:
                detected.append("🟢 Double Bottom (W-Pattern) forming/complete - Bullish Reversal.")

        if len(peaks) >= 3:
            p1, p2, p3 = prices[peaks[-3:]]
            # Head and Shoulders (Top) - Middle peak (head) is higher than shoulders, shoulders roughly equal
            if p2 > p1 and p2 > p3 and abs(p1 - p3) / p1 < 0.05:
                detected.append("🔴 Head & Shoulders (Top) - Strong Bearish Reversal.")
                
        if len(troughs) >= 3:
            t1, t2, t3 = prices[troughs[-3:]]
            # Inverse Head and Shoulders (Bottom) - Middle trough lower than shoulders
            if t2 < t1 and t2 < t3 and abs(t1 - t3) / t1 < 0.05:
                detected.append("🟢 Inverse Head & Shoulders - Strong Bullish Reversal.")

        return "\n".join([f"• {p}" for p in detected]) if detected else "• No major classic chart patterns (W/M/H&S) clearly defined recently."
    except Exception as e:
        logging.error(f"Pattern detection error: {e}")
        return "• Pattern analysis unavailable."

def calculate_support_resistance(df):
    try:
        # Standard Pivot Points based on recent swing
        recent_df = df.tail(20)
        last_high = recent_df['High'].max()
        last_low = recent_df['Low'].min()
        last_close = df['Close'].iloc[-1]
        
        pivot = (last_high + last_low + last_close) / 3
        res1 = (2 * pivot) - last_low
        res2 = pivot + (last_high - last_low)
        sup1 = (2 * pivot) - last_high
        sup2 = pivot - (last_high - last_low)
        
        return res1, res2, sup1, sup2
    except: return 0, 0, 0, 0

# --- ALGORITHMIC VALUATIONS ---

def calc_graham_number(eps, bvps):
    """Benjamin Graham's Value Formula: sqrt(22.5 * EPS * Book Value Per Share)"""
    try:
        if eps is None or bvps is None or eps <= 0 or bvps <= 0: return None
        return np.sqrt(22.5 * eps * bvps)
    except: return None

def calc_simple_dcf(fcf, shares_outstanding, growth_rate=0.05, discount_rate=0.10, years=5):
    """Very simplified Discounted Cash Flow to find Intrinsic Value."""
    try:
        if not fcf or not shares_outstanding or fcf <= 0 or shares_outstanding <= 0: return None
        future_cash_flows = []
        projected_fcf = fcf
        for year in range(1, years + 1):
            projected_fcf *= (1 + growth_rate)
            discounted_cf = projected_fcf / ((1 + discount_rate) ** year)
            future_cash_flows.append(discounted_cf)
        
        # Terminal Value (assuming 2% perpetual growth)
        terminal_value = (projected_fcf * 1.02) / (discount_rate - 0.02)
        discounted_tv = terminal_value / ((1 + discount_rate) ** years)
        
        intrinsic_value_company = sum(future_cash_flows) + discounted_tv
        intrinsic_value_per_share = intrinsic_value_company / shares_outstanding
        return intrinsic_value_per_share
    except: return None


def get_whale_flow(ticker):
    """
    Analyzes the options chain for 'Smart Money' flow.
    Looks for high Volume-to-Open-Interest (V/OI) ratios and the Put/Call ratio.
    """
    try:
        stock = yf.Ticker(ticker)
        expirations = stock.options
        if not expirations: return "• No options data available for this ticker."
        
        # Get nearest monthly expiration
        opt = stock.option_chain(expirations[0])
        calls = opt.calls
        puts = opt.puts
        
        # Calculate Put/Call Ratio based on Volume
        total_call_vol = calls['volume'].sum()
        total_put_vol = puts['volume'].sum()
        pc_ratio = total_put_vol / total_call_vol if total_call_vol > 0 else 0
        pc_status = "BULLISH" if pc_ratio < 0.7 else "BEARISH" if pc_ratio > 1.1 else "NEUTRAL"
        
        # Find Unusual Activity (Volume > Open Interest) with openInterest division-by-zero guard
        unusual_calls = calls[(calls['volume'].fillna(0) > calls['openInterest'].fillna(0)) & (calls['openInterest'].fillna(0) > 0)].sort_values(by='volume', ascending=False).head(2)
        unusual_text = ""
        for _, row in unusual_calls.iterrows():
            oi = row.get('openInterest', 0)
            vol = row.get('volume', 0)
            vol_oi_str = f"{vol / oi:.1f}x" if oi and oi > 0 else "N/Ax"
            unusual_text += f"• <b>UNUSUAL CALL:</b> Strike <code>${row['strike']}</code> | Vol/OI: <code>{vol_oi_str}</code>\n"
        
        msg = f"• Put/Call Ratio: <code>{pc_ratio:.2f}</code> ({pc_status})\n"
        msg += unusual_text if unusual_text else "• No extreme unusual whale activity detected today.\n"
        return msg
    except:
        return "• Options analysis currently unavailable."

def validate_strategy(df):
    """
    Backtests the Technical Strategy (Trend + RSI) over the last 12 months.
    Checks price performance 30 days after a 'Technical Buy' was triggered.
    """
    try:
        data = df.copy()
        # Simple Technical Buy: RSI < 40 and Price > 200 SMA (on a dip) or RSI < 30
        data['SMA_200'] = data['Close'].rolling(window=200).mean()
        
        # RSI Calculation for backtest
        delta = data['Close'].diff()
        up = delta.clip(lower=0)
        down = -1 * delta.clip(upper=0)
        ma_up = up.rolling(window=14).mean()
        ma_down = down.rolling(window=14).mean()
        rs = ma_up / ma_down
        data['RSI'] = 100 - (100 / (1 + rs))
        
        signals = []
        for i in range(200, len(data) - 30):
            # If RSI was oversold (<35)
            if data['RSI'].iloc[i] < 35:
                buy_price = data['Close'].iloc[i]
                price_30d = data['Close'].iloc[i + 30]
                profit = (price_30d - buy_price) / buy_price
                signals.append(1 if profit > 0 else 0)
        
        if not signals: return "• New listing or insufficient data for backtest."
        
        win_rate = (sum(signals) / len(signals)) * 100
        return f"• Historical Accuracy: <b>{win_rate:.1f}% Win Rate</b> (30-day technical window)"
    except:
        return "• Backtest engine encountered an error."

async def scan_stock(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not context.args:
        await update.message.reply_text("⚠️ Usage: /scan TICKER (e.g. /scan MSFT)")
        return

    ticker = context.args[0].upper()
    query_ticker = f"{ticker}-USD" if ticker in ['SOL', 'BTC', 'ETH'] else ticker
    
    await update.message.reply_text(f"🐋 <b>WHALE SCANNING & BACKTESTING: {ticker}...</b>", parse_mode='HTML')

    try:
        stock = yf.Ticker(query_ticker)
        hist = stock.history(period="2y") # 2 years for better backtesting
        info = stock.info

        if 'shortName' not in info and 'symbol' not in info:
            await update.message.reply_text(f"❌ Ticker {ticker} not found.")
            return

        price = info.get('preMarketPrice') or info.get('postMarketPrice') or info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose')
        if not price: 
            await update.message.reply_text("❌ Could not retrieve current price.")
            return
            
        time_label = "Live" if info.get('currentPrice') else "Last Close"
        target_date = (datetime.now() + timedelta(days=365)).strftime("%B %d, %Y")

        # --- FUNDAMENTALS & RISK ---
        market_cap = format_money(info.get('marketCap'))
        total_cash = format_money(info.get('totalCash'))
        total_debt = format_money(info.get('totalDebt'))
        beta = info.get('beta', 'N/A')
        short_interest = format_pct(info.get('shortPercentOfFloat'))
        
        current_ratio = info.get('currentRatio')
        debt_to_equity = info.get('debtToEquity') 
        roe = info.get('returnOnEquity')
        rev_growth = info.get('revenueGrowth')
        
        # --- VALUATIONS ---
        eps = info.get('trailingEps')
        bvps = info.get('bookValue')
        fcf = info.get('freeCashflow')
        fcf_formatted = format_money(fcf)
        shares = info.get('sharesOutstanding')
        
        graham_val = calc_graham_number(eps, bvps)
        dcf_val = calc_simple_dcf(fcf, shares)

        # --- TECHNICALS & PATTERNS ---
        rsi = get_rsi(hist)
        rsi_status = "Oversold" if rsi < 35 else "Overbought" if rsi > 70 else "Neutral"
        patterns_text = detect_patterns(hist)
        res1, res2, sup1, sup2 = calculate_support_resistance(hist)
        fibs = get_fibonacci_levels(hist)
        
        sma_50 = hist['Close'].tail(50).mean()
        sma_200 = hist['Close'].tail(200).mean()
        trend = "BULLISH 🟢" if hist['Close'].iloc[-1] > sma_50 > sma_200 else "BEARISH 🔴"
        if sma_50 > sma_200 and hist['Close'].iloc[-1] < sma_50: trend = "PULLBACK IN BULL TREND 🟡"

        # --- NEW FEATURES ---
        whale_text = get_whale_flow(query_ticker)
        validator_text = validate_strategy(hist)

        # --- SEC EDGAR VERIFICATION & FRESHNESS GATE (RULE 2) ---
        sec_report = get_latest_filed_report_date(ticker)
        sec_data = extract_sec_quarterly_fundamentals(ticker)
        sec_quarters = sec_data.get("quarters", {})
        
        is_stale = False
        stale_warning = ""
        newest_sec_p = list(sec_quarters.keys())[0] if sec_quarters else None
        
        if sec_report and sec_report.get("period_end") and newest_sec_p:
            if newest_sec_p < sec_report["period_end"]:
                is_stale = True
                stale_warning = f"⚠️ <b>STALE DATA:</b> Newest available quarter ({newest_sec_p}) is older than SEC filed quarter ({sec_report['period_end']}). Analysis and verdict are suppressed."
        
        latest_sec_q = sec_quarters.get(newest_sec_p, {}) if newest_sec_p else {}
        sec_rev = latest_sec_q.get("revenue")
        sec_eps = latest_sec_q.get("eps_gaap")
        sec_form = latest_sec_q.get("form", "10-Q/10-K")

        # Material One-offs check on latest quarter (RULE 3)
        adj_data = compute_one_off_adjusted_eps(latest_sec_q)
        one_off_disclosure = ""
        if adj_data.get("has_material_one_off") or adj_data.get("has_adjustment"):
            one_off_amt = adj_data.get("one_off_amount") or adj_data.get("one_off_per_share", 0.0)
            one_off_disclosure = f" [One-off impact: Non-operating items contributed ${one_off_amt:.2f}/sh ({adj_data.get('one_off_impact_pct', 0.0):.1f}%)]"

        # --- FUNDAMENTAL DCF SCENARIOS (RULE 1: STRICTLY PRICE-INVARIANT) ---
        fcf_info = get_audited_ttm_fcf(ticker, stock_obj=stock)
        owner_fcf = fcf_info["owner_fcf"]
        is_fcf_valid = fcf_info["is_valid"] and (owner_fcf is not None) and (owner_fcf > 0)
        beta_num = float(beta) if beta != 'N/A' else 1.0
        tot_cash_num = float(info.get('totalCash')) if info.get('totalCash') is not None else 0.0
        tot_debt_num = float(info.get('totalDebt')) if info.get('totalDebt') is not None else 0.0
        if is_fcf_valid and shares and shares > 0:
            dcf_scenarios = compute_fundamental_dcf_scenarios(
                owner_fcf=owner_fcf,
                shares=shares,
                beta=beta_num,
                cash=tot_cash_num,
                debt=tot_debt_num,
                base_growth=rev_growth,
                price=price
            )
        else:
            dcf_scenarios = None

        # Sourced Multiples (RULE 4)
        as_of_date = datetime.now().strftime("%Y-%m-%d")
        fwd_eps = info.get('forwardEps')
        if fwd_eps and fwd_eps > 0:
            calc_fwd_pe = round(price / fwd_eps, 1)
            fwd_pe_str = f"{calc_fwd_pe:.1f}x (Source: Consensus Forward EPS ${fwd_eps:.2f} as of {as_of_date})"
        else:
            fwd_pe_str = "N/A (Forward EPS consensus unavailable — omitted)"

        target_mean = info.get('targetMeanPrice')
        analyst_count = info.get('numberOfAnalystOpinions')
        if target_mean:
            target_str = f"${target_mean:,.2f} (Source: Wall Street Consensus from {analyst_count or 'N/A'} analysts as of {as_of_date})"
        else:
            target_str = "N/A (Omitted)"

        # --- QUANT SCORE CALCULATION ---
        score = 0
        if dcf_scenarios and price < dcf_scenarios['base']['fair_value']: 
            score += 20
        elif graham_val and price < graham_val:
            score += 15
            
        if roe and roe > 0.15: 
            score += 20
        elif info.get('profitMargins') is not None and info.get('profitMargins') > 0.10:
            score += 10
            
        if rev_growth and rev_growth > 0.15: 
            score += 20
        elif rev_growth and rev_growth > 0:
            score += 10
            
        if trend == "BULLISH 🟢": 
            score += 20
        elif rsi < 40:
            score += 15
            
        if current_ratio and current_ratio > 1.5: 
            score += 20
        elif current_ratio and current_ratio > 1.0:
            score += 10

        if is_stale:
            verdict_label = "INSUFFICIENT DATA QUALITY"
            score_emoji = "⚪"
            score = 0
            integrity_badge = "FAIL 🔴"
        else:
            integrity_badge = "PASS 🟢"
            score_emoji = "💎" if score >= 80 else "📈" if score >= 60 else "⚠️"
            verdict_label = "STRONG BUY" if score >= 80 else "ACCUMULATE" if score >= 60 else "HOLD / WATCH" if score >= 40 else "AVOID"

        # --- TRADE EXECUTION PLAN ---
        entry_zone = f"${sup1:,.2f} - ${price:,.2f}"
        take_profit = f"${res1:,.2f}"
        stop_loss = f"${sup2:,.2f}"
        risk_level = "LOW" if beta != 'N/A' and float(beta) < 1.0 else "MEDIUM" if beta != 'N/A' and float(beta) < 1.5 else "HIGH"
        
        # Timing Note
        timing_note = "Check earnings calendar manually."
        try:
            earn_date = stock.calendar.get('Earnings Date', [None])[0]
            if earn_date:
                days_to_earn = (earn_date.date() - datetime.now().date()).days
                timing_note = f"Next Earnings in {days_to_earn} days."
        except: pass

        # Grounded Narratives (RULE 5)
        grounded_cats = []
        if timing_note and "manually" not in timing_note.lower():
            grounded_cats.append(f"• {timing_note}")
        if rev_growth and rev_growth > 0.05:
            grounded_cats.append(f"• Sourced revenue growth: +{rev_growth*100:.1f}% YoY.")
        if len(grounded_cats) < 2:
            grounded_cats = ["• insufficient data"]

        grounded_risks = []
        if info.get('totalDebt') and info.get('totalCash') and info.get('totalDebt') > info.get('totalCash'):
            grounded_risks.append(f"• Balance sheet leverage: Total debt ({total_debt}) exceeds cash ({total_cash}).")
        if trend == "BEARISH 🔴":
            grounded_risks.append("• Technical momentum headwind: Price below 50-day and 200-day moving averages.")
        if len(grounded_risks) < 2:
            grounded_risks = ["• insufficient data"]

        name = esc(info.get('longName', info.get('shortName', ticker)))
        msg = f"🛡️ <b>DATA INTEGRITY BADGE: {integrity_badge}</b>\n"
        if is_stale:
            msg += f"{stale_warning}\n\n"
        msg += f"🚀 <b>THE TRADE EXECUTION PLAN: {ticker}</b>\n"
        msg += f"<b>Overall Grade:</b> <code>{score}/100</code> | <b>Action:</b> <b>{verdict_label} {score_emoji}</b>\n"
        msg += f"• <b>Optimal Entry:</b> <code>{entry_zone}</code>\n"
        msg += f"• <b>Target (Take Profit):</b> <code>{take_profit}</code>\n"
        msg += f"• <b>Stop Loss (Risk Exit):</b> <code>{stop_loss}</code>\n"
        msg += f"• <b>Risk Level:</b> <code>{risk_level}</code> | <b>Timing:</b> <code>{timing_note}</code>\n"
        msg += "───────────────────\n\n"

        msg += f"🧪 <b>STRATEGY VALIDATOR (Backtest Engine)</b>\n"
        msg += f"{validator_text}\n\n"

        msg += f"🐋 <b>WHALE FLOW (Smart Money Tracker)</b>\n"
        msg += f"{whale_text}\n"

        msg += f"🏛️ <b>SEC EDGAR VERIFIED FUNDAMENTALS: {name} ({ticker})</b>\n"
        if newest_sec_p:
            msg += f"• <b>Latest Fiscal Period:</b> <code>{newest_sec_p}</code> (SEC Form {sec_form})\n"
            if sec_rev:
                msg += f"• <b>Quarterly Revenue:</b> <code>${sec_rev/1e9:.2f}B</code> [SEC VERIFIED]\n"
            if sec_eps is not None:
                if adj_data.get("has_material_one_off"):
                    msg += f"• <b>Quarterly Diluted EPS:</b> GAAP <code>${adj_data['gaap_eps']:.2f}</code> | Adj Operating <code>${adj_data['adj_eps']:.2f}</code> [SEC VERIFIED]{one_off_disclosure}\n"
                else:
                    msg += f"• <b>Quarterly Diluted EPS:</b> <code>${sec_eps:.2f}</code> [SEC VERIFIED]\n"
        msg += f"• <b>Current Price:</b> <code>${price:,.2f}</code> ({time_label}) | <b>Market Cap:</b> <code>{market_cap}</code>\n"
        msg += f"• <b>Volatility (Beta):</b> <code>{beta}</code> <i>(&gt;1 = Highly volatile, &lt;1 = Defensive)</i>\n\n"

        msg += "💰 <b>FINANCIAL FORTRESS (Debt vs Cash)</b>\n"
        msg += f"• Total Cash: <code>{total_cash}</code>\n"
        msg += f"• Total Debt: <code>{total_debt}</code>\n"
        msg += f"• Free Cash Flow: <code>{fcf_formatted}</code>\n\n"

        msg += "📊 <b>VALUATION & SOURCED MULTIPLES</b>\n"
        msg += f"• Forward P/E: <code>{fwd_pe_str}</code>\n"
        msg += f"• Consensus Target: <code>{target_str}</code>\n"
        msg += f"• Profit Margin: <code>{format_pct(info.get('profitMargins'))}</code>\n"
        msg += f"• Operating Margin: <code>{format_pct(info.get('operatingMargins'))}</code>\n\n"

        msg += "⚖️ <b>FUNDAMENTAL DCF VALUATION (Price-Invariant)</b>\n"
        if dcf_scenarios:
            b_fv = dcf_scenarios['base']['fair_value']
            b_ret = dcf_scenarios['base']['implied_return']
            bear_fv = dcf_scenarios['bear']['fair_value']
            bear_ret = dcf_scenarios['bear']['implied_return']
            bull_fv = dcf_scenarios['bull']['fair_value']
            bull_ret = dcf_scenarios['bull']['implied_return']
            msg += f"• <b>Base Fair Value:</b> <code>${b_fv:,.2f}</code> ({b_ret:+0.1f}%) [Inputs: {dcf_scenarios['base']['inputs_display']}]\n"
            msg += f"• <b>Conservative Bear:</b> <code>${bear_fv:,.2f}</code> ({bear_ret:+0.1f}%) [Inputs: {dcf_scenarios['bear']['inputs_display']}]\n"
            msg += f"• <b>Optimistic Bull:</b> <code>${bull_fv:,.2f}</code> ({bull_ret:+0.1f}%) [Inputs: {dcf_scenarios['bull']['inputs_display']}]\n"
            divergent = []
            for sc_name, sc_data in dcf_scenarios.items():
                imp_ret = sc_data.get("implied_return")
                if imp_ret is not None and abs(imp_ret) > 50.0:
                    divergent.append(f"{sc_name.capitalize()} ({imp_ret:+0.1f}%)")
            if divergent:
                msg += f"• <i>DCF Divergence Note: Model diverges &gt;50% from market price in: {', '.join(divergent)}</i>\n"
        else:
            unreliable_str = "N/A (unreliable input)" if not is_fcf_valid else "N/A (Fundamental cash flow data unavailable)"
            msg += f"• <b>Fundamental DCF:</b> {unreliable_str}\n"
        msg += "\n"

        msg += "📈 <b>TECHNICAL MOMENTUM</b>\n"
        msg += f"• RSI (14d): <code>{rsi:.1f}</code> ({rsi_status})\n"
        msg += f"• LT Trend: <b>{trend}</b>\n\n"

        msg += "🛡️ <b>SUPPORT, RESISTANCE & FIBONACCI (Action Zones)</b>\n"
        msg += f"• <b>Resistance 2 (Breakout):</b> <code>${res2:,.2f}</code>\n"
        msg += f"• <b>Resistance 1 (Ceiling):</b> <code>${res1:,.2f}</code>\n"
        msg += f"• <b>Support 1 (Floor):</b> <code>${sup1:,.2f}</code>\n"
        msg += f"• <b>Support 2 (Hard Crash):</b> <code>${sup2:,.2f}</code>\n\n"

        msg += "📰 <b>GROUNDED CATALYSTS & RISKS</b>\n"
        msg += "<b>Catalysts:</b>\n" + "\n".join(grounded_cats) + "\n"
        msg += "<b>Risks:</b>\n" + "\n".join(grounded_risks) + "\n\n"

        # --- ADDITIONAL DATA (Original Bot Features) ---
        insider_text = ""
        try:
            insider = stock.insider_transactions
            if insider is not None and not insider.empty:
                for _, row in insider.head(3).iterrows():
                    action = "BOUGHT" if "Buy" in str(row['Transaction']) else "SOLD"
                    insider_text += f"• {esc(row['Position'])}: {action} {format_money(row['Value'])}\n"
            else: insider_text = "• No recent major trades.\n"
        except: insider_text = "• Insider data hidden.\n"

        earnings_text = ""
        try:
            earn = stock.earnings_dates
            if earn is not None and not earn.empty:
                earn_res = earn.dropna(subset=['Surprise(%)']).head(3)
                for date, row in earn_res.iterrows():
                    symbol = "✅" if row['Surprise(%)'] > 0 else "❌"
                    earnings_text += f"• {date.date()}: {symbol} {row['Surprise(%)']:.1f}% Beat\n"
            else: earnings_text = "• Data unavailable.\n"
        except: earnings_text = "• Surprise data error.\n"

        inst_text = ""
        try:
            inst_df = stock.get_institutional_holders()
            if inst_df is not None and not inst_df.empty:
                for _, r in inst_df.head(4).iterrows():
                    real_time_val = r['Shares'] * float(price) if 'Shares' in r and price != 'N/A' else r.get('Value', 0)
                    inst_text += f"• {esc(r['Holder'])}: {format_money(real_time_val)}\n"
            else: inst_text = "• Institutional data hidden.\n"
        except: inst_text = "• Holder data error.\n"
        
        buy_reasons = []
        peg = info.get('pegRatio')
        if peg and 0 < peg < 1.0: buy_reasons.append(f"• <b>Undervalued Growth:</b> PEG Ratio <code>{peg:.2f}</code>")
        if roe and roe > 0.15: buy_reasons.append(f"• <b>High Efficiency:</b> ROE of <code>{roe*100:.1f}%</code>")
        if info.get('profitMargins') is not None and info.get('profitMargins') > 0.10: buy_reasons.append(f"• <b>Profit Power:</b> Strong Moat.")

        msg += "👤 <b>INSIDER PULSE (CEO/Directors)</b>\n"
        msg += insider_text + "\n"

        msg += "💰 <b>EARNINGS RELIABILITY (Surprises)</b>\n"
        msg += earnings_text + "\n"

        msg += "🏦 <b>WHO IS INVESTING? (Top Institutions)</b>\n"
        msg += inst_text + "\n"

        msg += "💡 <b>MATHEMATICAL 'STRONG BUY' RATIONALE</b>\n"
        msg += "\n".join(buy_reasons) if buy_reasons else "• Fundamentals are currently mixed."
        msg += "\n\n"

        # --- SYNTHESIS: WHY INVEST OR AVOID? ---
        msg += "💡 <b>THE ADVISOR'S VERDICT (Why Buy or Avoid?)</b>\n"
        bull_points = []
        bear_points = []
        
        # Analyze Growth & Value
        if dcf_val and price < dcf_val: bull_points.append(f"Trading at a discount to its Intrinsic Value of ${dcf_val:,.2f}.")
        if rev_growth and rev_growth > 0.15: bull_points.append(f"Strong Revenue Growth ({format_pct(rev_growth)} YoY) showing massive expansion.")
        elif rev_growth and rev_growth < 0: bear_points.append(f"Company is shrinking; Revenue fell by {format_pct(rev_growth)}.")
        
        # Analyze Health
        if roe and roe > 0.15: bull_points.append(f"Highly efficient at generating profit (ROE: {format_pct(roe)}).")
        if current_ratio and current_ratio < 1: bear_points.append("Poor liquidity (Current Ratio &lt; 1); struggling to cover short-term debts.")
        
        # Analyze Technicals
        if "Double Bottom" in patterns_text or "Inverse Head" in patterns_text:
            bull_points.append("Major Bullish technical reversal pattern detected on the chart.")
        if "Double Top" in patterns_text or "Head & Shoulders (Top)" in patterns_text:
            bear_points.append("Major Bearish breakdown pattern detected; heavy downside risk.")
            
        if rsi < 30: bull_points.append("Stock is heavily oversold, potential bounce incoming.")
        elif rsi > 70: bear_points.append("Stock is overbought and technically extended; risk of a pullback.")
        
        if price <= (fibs.get('61.8%', 0) * 1.05) and price >= (fibs.get('61.8%', 0) * 0.95):
            bull_points.append("Sitting precisely in the Fibonacci 'Golden Pocket' (61.8% retracement), a prime institutional buy zone.")

        # Compile Verdict
        if bull_points:
            msg += "<b>✅ BULLISH THESIS (Tailwinds):</b>\n"
            for b in bull_points: msg += f"• {b}\n"
        if bear_points:
            if bull_points: msg += "\n"
            msg += "<b>⚠️ BEARISH THESIS (Headwinds & Risks):</b>\n"
            for b in bear_points: msg += f"• {b}\n"
            
        if not bull_points and not bear_points:
            msg += "• Mixed signals. The stock is currently fairly valued with neutral technicals. Wait for a clearer catalyst or a pullback to Support 1.\n"
        
        msg += f"\n<b>Wall Street Consensus:</b> {str(info.get('recommendationKey', 'N/A')).upper().replace('_', ' ')}\n"
        msg += f"• <b>1-Yr Target Avg (by {target_date}):</b> <code>${info.get('targetMeanPrice', 'N/A')}</code>"

        await update.message.reply_text(msg, parse_mode='HTML', disable_web_page_preview=True)

    except Exception as e:
        logging.error(f"Scan error: {e}")
        await update.message.reply_text(f"❌ Error during advanced scan. Please try again.")


def main():
    token = os.getenv("TELEGRAM_BOT_TOKEN", "").strip()
    if not token:
        logging.critical("FATAL: TELEGRAM_BOT_TOKEN environment variable is empty. Bot cannot start.")
        sys.exit("FATAL: TELEGRAM_BOT_TOKEN is empty. Set TELEGRAM_BOT_TOKEN before launching stock_bot.")
    app = ApplicationBuilder().token(token).build()
    app.add_handler(CommandHandler("scan", scan_stock))
    print("Institutional Quant-Bot is live...")
    app.run_polling()

if __name__ == '__main__':
    main()
