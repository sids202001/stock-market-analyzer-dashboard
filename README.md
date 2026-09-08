# 📈 Real-Time Stock Market Technical Analysis Dashboard

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/Yahoo_Finance-Zero_API_Keys-6001D2?style=for-the-badge&logo=yahoo&logoColor=white" alt="Yahoo Finance" />
  <img src="https://img.shields.io/badge/pandas-Vectorized_Math-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/Chart.js-Dark_Theme_Charts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=for-the-badge" alt="In-Memory Cache" />
</p>

Evaluating a stock normally means drowning in browser tabs. You have one tab open for price charts on TradingView, another for financial statements on Yahoo Finance, a third for options chains, and you still run into paywalls, ads, or API rate limits. I built this dashboard to fix that entire headache: a completely free, all-in-one stock analysis platform that gives everyday investors an honest, 360-degree breakdown of any company in seconds—with zero API keys and zero subscription fees.

The platform is driven by a multi-threaded Python backend that streams live market data from Yahoo Finance, protected by an in-memory 2-minute cache so you can scan dozens of tickers without getting rate-limited. The moment you search any stock, the engine runs deep checks across three key areas: it monitors the broader market health by tracking the S&P 500 trend so you don't buy into a falling market; it stress-tests the company’s balance sheet using proven financial health formulas like the Piotroski F-Score and Altman Z-Score to catch hidden debt or bankruptcy risks; and it tracks what corporate insiders (CEOs and directors) are doing with their own money alongside institutional holdings. It combines that with technical signals (50/200-day moving average crosses, RSI momentum, and MACD), Put-to-Call options volume, and earnings beat history to generate an automated investment brief with realistic Buy, Hold, or Sell targets. Everything renders instantly in a clean, dark-mode interface with interactive charts, replacing hours of scattered manual research with a single, clear summary.

<p align="left">
  <img src="https://img.shields.io/badge/Python_3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/Yahoo_Finance-Zero_API_Keys-6001D2?style=flat-square&logo=yahoo&logoColor=white" alt="Yahoo Finance" />
  <img src="https://img.shields.io/badge/Macro_Regime-S%26P_500_Trend-success?style=flat-square" alt="Macro Regime" />
  <img src="https://img.shields.io/badge/Financial_Health-Piotroski_%7C_Altman_Z-blue?style=flat-square" alt="Financial Health" />
  <img src="https://img.shields.io/badge/Technical_Signals-SMA_%7C_RSI_%7C_MACD-orange?style=flat-square" alt="Technical Signals" />
  <img src="https://img.shields.io/badge/Smart_Money-Options_Flow_%7C_Insider_Trades-blueviolet?style=flat-square" alt="Smart Money" />
  <img src="https://img.shields.io/badge/Chart.js-Interactive_Charts-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="Chart.js" />
</p>

---

## 📁 Project Structure

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
