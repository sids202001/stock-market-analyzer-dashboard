# 📈 Real-Time Stock Market Technical Analysis Dashboard

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/Yahoo_Finance-Zero_API_Keys-6001D2?style=for-the-badge&logo=yahoo&logoColor=white" alt="Yahoo Finance" />
  <img src="https://img.shields.io/badge/pandas-Vectorized_Math-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/Chart.js-Dark_Theme_Charts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=for-the-badge" alt="In-Memory Cache" />
</p>

Professional financial terminals like Bloomberg cost thousands of dollars a year, and free retail screener websites are either bloated with paywalls, spammy ads, or break under aggressive API rate limits. Worse, retail investors are forced to juggle three different tools just to evaluate a single stock—one tab for price charts, another for financial statements, and another for options chains. I built this platform to bring institutional-grade equity intelligence, algorithmic technical signals, and automated financial analysis into a single, lightning-fast dashboard that anyone can use for free with zero API keys.

The platform is driven by a multi-threaded Python backend that streams live Wall Street market data directly from Yahoo Finance, decoupled by a thread-safe in-memory 2-minute TTL cache that prevents upstream vendor throttling during high-frequency scans. The engine processes vector math in real time to calculate 50/200-day moving average crossovers (Golden Crosses and Death Crosses), 14-period RSI momentum, MACD distributions, and 52-week Fibonacci support and resistance bands. Beyond raw technicals, the platform pipes company balance sheets, cash flow, debt-to-cash ratios, and historical earnings surprises into a generative AI financial reasoning pipeline. The AI analyzes these quantitative matrices on the fly to generate executive-level investment briefs—outlining company moats, upcoming market catalysts, risk ratings, and disciplined stop-loss recommendations for any global ticker. Paired with interactive options chains and dark-mode Chart.js visualizations, the dashboard delivers sub-second, comprehensive investment intelligence with zero subscription overhead.

<p align="left">
  <img src="https://img.shields.io/badge/Quantitative_Indicators-SMA_%7C_RSI_%7C_MACD_%7C_Fibonacci-success?style=flat-square" alt="Technical Indicators" />
  <img src="https://img.shields.io/badge/Generative_AI-Investment_Briefs-7952B3?style=flat-square" alt="Generative AI" />
  <img src="https://img.shields.io/badge/ThreadingHTTPServer-Concurrent_Backend-007ACC?style=flat-square" alt="Server" />
  <img src="https://img.shields.io/badge/yfinance-Real--time_Market_Data-6001D2?style=flat-square&logo=yahoo" alt="yfinance" />
  <img src="https://img.shields.io/badge/Chart.js-Interactive_Visualization-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="Chart.js" />
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
