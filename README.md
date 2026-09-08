# 📈 Real-Time Stock Market Technical Analysis Dashboard

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/Yahoo_Finance-Zero_API_Keys-6001D2?style=for-the-badge&logo=yahoo&logoColor=white" alt="Yahoo Finance" />
  <img src="https://img.shields.io/badge/pandas-Vectorized_Math-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/Chart.js-Dark_Theme_Charts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=for-the-badge" alt="In-Memory Cache" />
</p>

Most retail market screeners either lock essential financial data behind expensive paywalls or rely on fragile third-party APIs that break under strict rate limits and require complex subscription keys. I built this full-stack market intelligence platform to provide instant, high-throughput equity analysis through a single browser interface—engineered as a self-contained, zero-dependency system that streams live market data with zero API keys and zero external database overhead.

Under the hood, the backend is powered by a multi-threaded Python server (`ThreadingHTTPServer`) that exposes REST endpoints for live quotes, historical time series, options chains, and peer metrics. To prevent upstream vendor throttling and maintain sub-second response times, the server utilizes a thread-safe in-memory caching layer with a 2-minute TTL protected by thread locks, eliminating redundant outbound queries during high-frequency scans. When a ticker is requested, the system executes vectorized time-series processing using pandas—computing rolling moving averages, exponential momentum oscillators (RSI, MACD), and dynamic support levels in memory—while an asynchronous `ThreadPoolExecutor` queries comparative peer data concurrently in the background. On the frontend, a lightweight Vanilla ES6+ single-page application with zero build-tool dependencies consumes the JSON endpoints and renders interactive, multi-timeframe Chart.js visualizations in under 500ms, providing a seamless and responsive analytical workflow.

<p align="left">
  <img src="https://img.shields.io/badge/Python_3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/ThreadingHTTPServer-Concurrent_Backend-007ACC?style=flat-square" alt="Concurrent Backend" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=flat-square" alt="In-Memory Cache" />
  <img src="https://img.shields.io/badge/pandas-Vectorized_Processing-150458?style=flat-square&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/ThreadPoolExecutor-Async_Workers-success?style=flat-square" alt="ThreadPoolExecutor" />
  <img src="https://img.shields.io/badge/REST_API-6_Endpoints-blueviolet?style=flat-square" alt="REST API" />
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
