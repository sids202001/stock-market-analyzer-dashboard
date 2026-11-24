# 📈 AI Stock Market Analysis Dashboard

**Live Demo:** https://stock-market-analyzer-dashboard.vercel.app

<p align="left">
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python 3.10+" />
  <img src="https://img.shields.io/badge/Flask_+_Gunicorn-WSGI_Backend-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask + Gunicorn" />
  <img src="https://img.shields.io/badge/Market_Data-Zero_Market--Data_API_Keys-6001D2?style=for-the-badge&logo=yahoo&logoColor=white" alt="Zero Market-Data API Keys" />
  <img src="https://img.shields.io/badge/SEC_EDGAR-Verified_Filings-0F766E?style=for-the-badge" alt="SEC EDGAR" />
  <img src="https://img.shields.io/badge/Telegram_Bot-Live_Scanner-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram Bot" />
</p>

A full-stack equity intelligence platform combining live market pricing, **SEC EDGAR** financial statement verification, price-invariant **3-scenario DCF valuation**, technical pattern analysis, optional **LLM synthesis** (NVIDIA NIM / Gemini with deterministic fallback), and a companion **Telegram scanner bot** (`@my_stockmarket_scan_bot`).

- **Zero Market-Data API Keys:** Live quotes, historical OHLCV, options chains, financials, and SEC filings are pulled via keyless `yfinance` and public SEC EDGAR APIs. Optional environment keys (`TELEGRAM_BOT_TOKEN`, `GEMINI_API_KEY`, `NVIDIA_API_KEY`) enable the Telegram bot and optional LLM narrative layer.
- **Flask + Gunicorn Backend (`stock_app.py`):** Exposes `/scan/<ticker>`, `/api/decision/<ticker>`, `/api/macro`, and `/api/bulk-prices` with thread-safe in-memory caching (2-minute TTL for bulk prices, 30-minute TTL for macro regime) and per-IP rate limiting (30 req/min on `/scan`).
- **Real Subsystems:**
  - **SEC EDGAR Verification (`sec_edgar.py`):** Pulls canonical 10-Q/10-K revenue, diluted EPS, one-off adjusted EPS reconciliation, and shares outstanding directly from SEC company facts.
  - **Price-Invariant DCF Engine (`dcf_engine.py`, `independent_dcf_validator.py`):** Computes Bear / Base / Bull intrinsic fair values anchored to cash flows and WACC rather than current share price.
  - **Decision Cockpit (`decision_engine.py`, `script_final.js`):** 8-section executive investment modal with VanillaTilt 3D glass cards and live price hydration.
  - **Telegram Bot (`stock_bot.py`):** On-demand `/scan <TICKER>` command returning SEC-verified fundamentals, DCF scenarios, whale flow, and strategy backtest validation.
  - **Audit & Onboarding Harnesses:** Automated data-integrity, DCF invariance, deployment drill, and Playwright UI verification suites.

---

## ⚙️ Local Setup

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Run Flask + Gunicorn dashboard (http://127.0.0.1:8080)
./bin/run_app.sh

# Optional: run Telegram bot (requires TELEGRAM_BOT_TOKEN in .env)
python3 stock_bot.py
```

---

## 📁 Project Structure (34 Files)

```text
stock-dashboard/
├── stock_app.py                  # Flask + Gunicorn WSGI server (/scan, /api/decision, /api/macro, /api/bulk-prices)
├── stock_bot.py                  # Telegram scanner bot (/scan <TICKER>)
├── sec_edgar.py                  # SEC EDGAR 10-Q/10-K financial & adjusted-EPS extractor
├── dcf_engine.py                 # Price-invariant 3-scenario (Bear/Base/Bull) DCF engine
├── decision_engine.py            # 8-section investment decision synthesis engine
├── ticker_registry.py            # Ticker normalization and alias registry
├── audit_logger.py               # Structured JSONL scan audit logger
├── calculate_portfolio.py        # CLI portfolio P&L calculator
├── index.html                    # Main 3D glass-card dashboard UI
├── stock_dashboard.html          # Alternate dashboard layout
├── guide.html                    # Investing fundamentals guide
├── style.css                     # Dark-theme glassmorphism stylesheet
├── script_final.js               # Live price hydration, search/filter, and 8-section Decision Cockpit modal
├── generate_detail.js            # Legacy detail modal renderer
├── golden_a4.js                  # Golden test fixture (A4)
├── golden_e8.js                  # Golden test fixture (E8)
├── golden_l6.js                  # Golden test fixture (L6)
├── bin/
│   ├── run_app.sh                # Gunicorn background service runner
│   └── service_manager.sh        # macOS LaunchAgent service helper
├── tests/
│   └── test_deployment_drills.py # Deployment and endpoint drill tests
├── acceptance_gate_battery.py    # Acceptance gate verification battery
├── audit_battery.py              # Security & data integrity audit battery
├── independent_dcf_validator.py  # Independent DCF price-invariance validator
├── onboarding_gate.py            # Onboarding integrity checks
├── test_audit_fixes.py           # Regression suite for audit fixes
├── test_playwright.py            # Playwright browser smoke test
├── validation_harness.py         # End-to-end validation harness
├── requirements.txt              # Python dependencies
├── Procfile                      # Gunicorn process declaration
├── render.yaml                   # Render deployment blueprint
├── vercel.json                   # Vercel static deployment config
├── .vercelignore                 # Vercel ignore rules
├── .gitignore                    # Git ignore rules (.env, venv, logs, caches)
└── README.md                     # Project documentation
```
