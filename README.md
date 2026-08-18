# Stock Market Analyzer Dashboard

A stock research dashboard that pulls live data from Yahoo Finance, runs technical analysis, and tells you whether to buy, hold, or avoid — all from a single Python server with no API keys.

### How It Works
> **"One server, zero API keys — live Wall Street data in your browser."**
> 
> Most stock analysis tools cost money or need paid API subscriptions. I didn't want that. So I built this:
> 1. **The Server**: A Python HTTP server that talks to Yahoo Finance through `yfinance`, crunches the numbers (RSI, MACD, moving average crossovers, Fibonacci levels), and hands it all back as clean JSON. It caches prices for 2 minutes so Yahoo doesn't throttle you.
> 2. **The Dashboard**: A dark-themed frontend that takes all that data and turns it into interactive charts, stock cards with buy/sell badges, options tables, earnings history, insider trades — the works. Built with vanilla JS and Chart.js.
> 3. **Portfolio Tracking**: A small CLI script where you plug in your holdings (stocks, crypto, ETFs) and it spits out your real P&L, cost basis, and where analysts think each position is headed.

---

## Architecture

```
  Browser (index.html + script_final.js)
       │
       │  HTTP GET /api/*
       ▼
  Python ThreadingHTTPServer (server.py, port 8080)
       │
       ├─ /api/bulk-prices     → Cached bulk ticker quotes (2-min TTL)
       ├─ /api/search          → Symbol lookup + full analysis
       │    └─ Returns: price, SMA50/200, RSI, MACD, Fibonacci,
       │       earnings history, insider trades, options chain, news
       ├─ /api/chart           → Historical OHLCV data (1d–5y)
       ├─ /api/options         → Options chain with strike prices
       ├─ /api/financials      → Income statement + SEC filings
       └─ /api/insider-trades  → Recent insider buy/sell activity
       │
       ▼
  Yahoo Finance (yfinance library)
```

---

## Getting Started

### Prerequisites
- Python 3.9+
- pip

### Installation

```bash
# 1. Clone the repo
cd stock-market-analyzer-dashboard

# 2. Set up a virtual environment
python3 -m venv venv
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt
```

### Run

```bash
python3 server.py
```

Open **http://localhost:8080** and you're in.

---

## What You Can Do

### 1. Browse the Dashboard
Fire up the server and you'll see 20+ stock cards right away — each one showing the live price, a buy/sell/hold verdict, and a quick summary. Cards are filterable by rating.

```bash
python3 server.py
# → http://localhost:8080
```

### 2. Dig Into Any Stock
Click a card and it opens a detail view with everything:
- 1-year price chart with SMA-50/SMA-200 overlay (golden cross / death cross detection)
- RSI and MACD charts so you can read momentum at a glance
- Fibonacci retracement levels marking support and resistance
- Earnings table showing EPS estimates vs actuals and how many quarters they've beaten in a row
- Latest news headlines pulled straight from Yahoo
- Insider trades — who's buying, who's selling
- Options chain with strikes, volume, and open interest

### 3. Search Any Ticker
Type a company name or symbol into the search bar — `AAPL`, `RELIANCE.NS`, `0700.HK`, whatever. The server resolves it through Yahoo Finance and builds a full analysis on the fly.

### 4. Track Your Portfolio
Open `calculate_portfolio.py`, swap in your own positions (ticker, shares, average cost), and run it:

```bash
python3 calculate_portfolio.py
```

You'll get a table showing cost basis, current market value, and analyst target projections per holding.

### 5. Read the Beginner's Guide
There's a "Complete Beginner's Guide" link in the dashboard header. It opens `guide.html`, which walks through what actually moves stock prices, how to read charts, and basic investing concepts. Wrote it for friends who kept asking me to explain stuff.

---

## API Endpoints

| Endpoint | Method | What it does |
|---|---|---|
| `/api/bulk-prices?tickers=` | GET | Batch price quotes, cached for 2 min |
| `/api/search?q=` | GET | Symbol lookup + full technical & fundamental analysis |
| `/api/chart?ticker=&period=` | GET | Historical price data (OHLCV) |
| `/api/options?ticker=` | GET | Options chain with strikes |
| `/api/financials?ticker=` | GET | Income statement + SEC filing links |
| `/api/insider-trades?ticker=` | GET | Recent insider transactions |

---

## Project Structure

```
stock-dashboard/
├── server.py               # Python HTTP server, handles all 6 API routes
├── index.html              # Main dashboard page
├── style.css               # Dark theme with glassmorphism cards
├── script_final.js         # All the frontend logic — cards, charts, filters, search
├── generate_detail.js      # Builds the detail modal content (charts, options, earnings)
├── guide.html              # Beginner's investing guide
├── calculate_portfolio.py  # CLI tool — plug in your holdings, get P&L
├── test_playwright.py      # Playwright-based UI smoke test
├── requirements.txt        # yfinance, pandas
└── .gitignore
```

---

## Good to Know

- No API keys needed. Everything goes through `yfinance` which hits public Yahoo Finance endpoints.
- Prices are cached for 2 minutes so you don't get rate-limited during heavy use.
- International tickers work fine — `RELIANCE.NS`, `0700.HK`, `TCS.NS`, etc.
- The portfolio calculator needs you to manually edit your positions in `calculate_portfolio.py`.
- On macOS, Python sometimes has SSL certificate issues — the server already handles that with an SSL context bypass.

---

## License

MIT
