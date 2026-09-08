# 📈 Real-Time Stock Market Technical Analysis Dashboard

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/Yahoo_Finance-Zero_API_Keys-6001D2?style=for-the-badge&logo=yahoo&logoColor=white" alt="Yahoo Finance" />
  <img src="https://img.shields.io/badge/pandas-Vectorized_Math-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/Chart.js-Dark_Theme_Charts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=for-the-badge" alt="In-Memory Cache" />
</p>

Most retail market screeners either hide essential analytics behind expensive paywalls or rely on brittle, rate-limited third-party APIs. I engineered this full-stack quantitative equity analysis platform to deliver institutional-grade research capabilities in a single, lightweight browser environment—operating completely standalone with zero API keys, zero subscription overhead, and sub-second response times. The backend is driven by a multi-threaded Python server featuring a thread-safe in-memory 2-minute TTL cache and asynchronous `ThreadPoolExecutor` workers, enabling high-frequency batch queries across global tickers without vendor throttling or external database dependencies.

Under the hood, the system executes an automated multi-factor scoring pipeline that evaluates every asset across three distinct dimensions. At the macro layer, it benchmarks the S&P 500 against its 50-day and 200-day moving averages to classify broader market regimes (Risk-On Bull vs. Risk-Off Bear). At the fundamental layer, algorithmic modules parse corporate financial statements to compute hedge-fund metrics, including the Piotroski 9-factor F-Score, Altman Z-Score insolvency risk, and Greenblatt’s Magic Formula, while tracking real-time C-suite insider transactions and earnings beat streaks. At the market sentiment layer, the engine aggregates options chains to compute near-the-money implied volatility and Put/Call volume ratios alongside vectorized technical signals (SMA Golden/Death Crosses, 14-period RSI, and 52-week Fibonacci retracements). Paired with an interactive vanilla ES6+ and Chart.js frontend, the platform synthesizes complex multi-stream financial data into a unified, actionable investment verdict in under 500 milliseconds.

<p align="left">
  <img src="https://img.shields.io/badge/Python_3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/ThreadingHTTPServer-Concurrent_Backend-007ACC?style=flat-square" alt="Concurrent Backend" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=flat-square" alt="In-Memory Cache" />
  <img src="https://img.shields.io/badge/Quant_Pipeline-Piotroski_%7C_Altman_Z_%7C_Magic_Formula-success?style=flat-square" alt="Quant Pipeline" />
  <img src="https://img.shields.io/badge/Options_Analytics-IV_%7C_Put--Call_Ratios-blueviolet?style=flat-square" alt="Options Analytics" />
  <img src="https://img.shields.io/badge/Technical_Signals-SMA_%7C_RSI_%7C_Fibonacci-orange?style=flat-square" alt="Technical Signals" />
  <img src="https://img.shields.io/badge/Frontend-Vanilla_ES6+_%7C_Chart.js-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="Frontend" />
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
