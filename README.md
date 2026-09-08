# 📈 Real-Time Stock Market Technical Analysis Dashboard

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/Yahoo_Finance-Zero_API_Keys-6001D2?style=for-the-badge&logo=yahoo&logoColor=white" alt="Yahoo Finance" />
  <img src="https://img.shields.io/badge/pandas-Vectorized_Math-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/Chart.js-Dark_Theme_Charts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=for-the-badge" alt="In-Memory Cache" />
</p>

Most retail financial screeners rely on expensive third-party APIs, break under strict vendor rate limits, or force users to manage multiple subscription keys. I built this full-stack market analysis platform to provide high-throughput, low-latency equity intelligence in a single browser interface—engineered as a self-contained, zero-dependency system that operates entirely without paid API keys or external database overhead.

The backend is powered by a multi-threaded Python server (`ThreadingHTTPServer`) featuring a thread-safe in-memory 2-minute TTL cache that prevents upstream request throttling during high-frequency queries. When a ticker is searched, the engine executes vectorized time-series processing via `pandas`: computing 50/200-day rolling moving average crossovers, 14-period RSI momentum distributions, exponential MACD signal lines, and 52-week Fibonacci retracement levels. In parallel, a `ThreadPoolExecutor` queries comparative peer metrics while algorithmic evaluation pipelines parse balance sheets, income statements, and cash flow data to calculate Altman Z-Score and Piotroski F-Score metrics. The server also ingests options chains to extract near-the-money implied volatility and Put/Call volume ratios. On the frontend, a lightweight vanilla ES6+ client-side architecture renders interactive Chart.js visualizations, live ticker search, and consensus data models with sub-second response times.

<p align="left">
  <img src="https://img.shields.io/badge/Python_3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/ThreadingHTTPServer-Concurrent_Backend-007ACC?style=flat-square" alt="ThreadingHTTPServer" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=flat-square" alt="In-Memory Cache" />
  <img src="https://img.shields.io/badge/pandas-Vectorized_Time--Series-150458?style=flat-square&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/Algorithms-Piotroski_%7C_Altman_Z_%7C_SMA_%7C_RSI-success?style=flat-square" alt="Algorithms" />
  <img src="https://img.shields.io/badge/Options_Engine-IV_%7C_Put--Call_Ratios-blueviolet?style=flat-square" alt="Options Engine" />
  <img src="https://img.shields.io/badge/Chart.js-Vanilla_ES6+-FF6384?style=flat-square&logo=chartdotjs&logoColor=white" alt="Chart.js" />
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
