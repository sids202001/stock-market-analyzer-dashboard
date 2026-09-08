# 📈 Real-Time Stock Market Technical Analysis Dashboard

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.9+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/Yahoo_Finance-Zero_API_Keys-6001D2?style=for-the-badge&logo=yahoo&logoColor=white" alt="Yahoo Finance" />
  <img src="https://img.shields.io/badge/pandas-Vectorized_Math-150458?style=for-the-badge&logo=pandas&logoColor=white" alt="pandas" />
  <img src="https://img.shields.io/badge/Chart.js-Dark_Theme_Charts-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Chart.js" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=for-the-badge" alt="In-Memory Cache" />
</p>

Most retail market screeners either lock essential financial data behind expensive paywalls or rely on fragile third-party APIs that break under strict rate limits and require complex subscription keys. I built this full-stack market intelligence platform to provide instant, high-throughput equity analysis through a single browser interface—engineered as a self-contained, zero-dependency system that streams live market data with zero API keys and zero external database overhead.

Under the hood, the backend is powered by a multi-threaded Python server (`ThreadingHTTPServer`) that exposes REST endpoints for live quotes, historical time series, options chains, and valuation metrics. To prevent upstream vendor throttling and maintain sub-second response times, the server utilizes a thread-safe in-memory caching layer with a 2-minute TTL protected by thread locks, eliminating redundant outbound queries during high-frequency scans. When a ticker is requested, the system executes a dual-layer analysis pipeline: at the technical layer, it leverages pandas and SciPy (`scipy.signal.find_peaks`) to detect chart patterns (e.g., Double Tops/Bottoms, Head & Shoulders) and momentum shifts for precise entry and exit timing; at the fundamental layer, it stress-tests balance sheet liquidity, valuation multiples, and earnings performance to assess core business health. By cross-referencing technical breakouts with fundamental intrinsic value, the platform automatically generates actionable Buy, Hold, or Sell calls with dynamic target upsides, while a lightweight Vanilla ES6+ and Chart.js frontend renders the complete breakdown in under 500ms.

<p align="left">
  <img src="https://img.shields.io/badge/Python_3.9+-3776AB?style=flat-square&logo=python&logoColor=white" alt="Python 3.9+" />
  <img src="https://img.shields.io/badge/ThreadingHTTPServer-Concurrent_Backend-007ACC?style=flat-square" alt="Concurrent Backend" />
  <img src="https://img.shields.io/badge/In--Memory_Cache-2--min_TTL-orange?style=flat-square" alt="In-Memory Cache" />
  <img src="https://img.shields.io/badge/SciPy-Pattern_Recognition-0054FF?style=flat-square&logo=scipy&logoColor=white" alt="SciPy" />
  <img src="https://img.shields.io/badge/Analysis-Technical_%26_Fundamental-success?style=flat-square" alt="Technical & Fundamental" />
  <img src="https://img.shields.io/badge/Signals-Buy_%7C_Hold_%7C_Sell-blueviolet?style=flat-square" alt="Buy/Sell Signals" />
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
