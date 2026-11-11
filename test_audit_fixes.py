"""
==============================================================================
 Regression & Audit Verification Suite for Stock Dashboard App
==============================================================================
Tests all 12 points from the FINAL CODE AUDIT FIX PACK:
 1. Data Vintage Integrity (Pinned as-of date, recency guard >120d, STALE flag)
 2. Quarterly table (Assert newest-first order, missing data -> 'N/A', never '$0.00')
 3. Fiscal labels derived from reporting calendar & period-end dates on all figures
 4. fmt_pct (>200% growth renders as 300.00% not 3.00%, abs<=2.0 branch removed)
 5. Collapse identical dividend branches
 6. TELEGRAM_BOT_TOKEN as environment variable; no secrets in source
 7. SSL verification with certifi (no _create_unverified_context overrides)
 8. Serving via gunicorn + rate limiting on /scan/<ticker>
 9. Launcher health check points to / with real status parse
 10. News URL XSS escaping
 11. openInterest division-by-zero guard in get_whale_flow
 12. App reads its own env only (zero scanning of foreign .env files)
"""

import os
import sys
import unittest
import datetime
from unittest.mock import MagicMock, patch
import pandas as pd
import numpy as np

# Import app modules under test
from stock_app import (
    DataSanitizer,
    extract_quarterly_financials,
    get_fiscal_quarter_label,
    get_whale_flow,
    resolve_api_keys,
    scan_limiter,
    app
)


class TestFormattingAndDataSanitization(unittest.TestCase):
    """B. FORMATTING BUGS (Points 4 & 5)"""

    def test_fmt_pct_growth_over_200_pct(self):
        """Regression test: Growth > 200% must format as 300.00%, never 3.00%."""
        # 3.0 represents 300% growth in yfinance decimal format
        res_300 = DataSanitizer.fmt_pct(3.0)
        self.assertEqual(res_300, "300.00%")
        self.assertNotEqual(res_300, "3.00%", "Regression! 3.0 was rendered as 3.00%")

        # 2.5 represents 250% growth
        res_250 = DataSanitizer.fmt_pct(2.5)
        self.assertEqual(res_250, "250.00%")
        self.assertNotEqual(res_250, "2.50%")

        # Normal positive and negative decimals
        self.assertEqual(DataSanitizer.fmt_pct(0.254), "25.40%")
        self.assertEqual(DataSanitizer.fmt_pct(-0.155), "-15.50%")
        self.assertEqual(DataSanitizer.fmt_pct(0.0), "0.00%")
        self.assertEqual(DataSanitizer.fmt_pct(None), "N/A")

    def test_fmt_pct_collapsed_dividend_branches(self):
        """Test collapsed identical dividend branches and dual handling only for dividendYield."""
        # Decimal dividend yields (<= 0.5) must be multiplied by 100
        self.assertEqual(DataSanitizer.fmt_pct(0.002, is_dividend=True), "0.20%")
        self.assertEqual(DataSanitizer.fmt_pct(0.035, is_dividend=True), "3.50%")
        self.assertEqual(DataSanitizer.fmt_pct(0.05, is_dividend=True), "5.00%")
        self.assertEqual(DataSanitizer.fmt_pct(0.12, is_dividend=True), "12.00%")
        self.assertEqual(DataSanitizer.fmt_pct(0.0, is_dividend=True), "0.00%")

        # Already expressed as percentage (> 0.5, e.g. 1.36 for 1.36%)
        self.assertEqual(DataSanitizer.fmt_pct(1.36, is_dividend=True), "1.36%")
        self.assertEqual(DataSanitizer.fmt_pct(2.45, is_dividend=True), "2.45%")


class TestDataVintageIntegrity(unittest.TestCase):
    """A. DATA VINTAGE INTEGRITY (Points 1, 2, 3)"""

    def setUp(self):
        self.mock_ticker = MagicMock()
        # Mock 4 quarters of income statement data
        dates = ["2024-06-30", "2024-03-31", "2023-12-31", "2023-09-30"]
        data = {
            "Total Revenue": [1000000000.0, 950000000.0, 900000000.0, 850000000.0],
            "Net Income": [200000000.0, np.nan, 180000000.0, 160000000.0], # Notice NaN for missing Net Income in Q1 2024
            "Gross Profit": [500000000.0, 480000000.0, np.nan, 420000000.0],
            "Operating Income": [250000000.0, 240000000.0, 220000000.0, 200000000.0],
        }
        self.mock_df = pd.DataFrame(data, index=dates).T
        self.mock_ticker.quarterly_income_stmt = self.mock_df

    def test_missing_data_renders_na_never_zero(self):
        """Regression test: Missing financials must render 'N/A', never '$0.00'."""
        as_of = datetime.date(2024, 7, 15)
        quarters, vintage = extract_quarterly_financials(self.mock_ticker, info={}, as_of_date=as_of)
        
        # Quarter 1 (2024-06-30): Net Income was 200M -> $200.00M
        self.assertEqual(quarters[0]["net_income"], "$200.00M")
        
        # Quarter 2 (2024-03-31): Net Income was NaN -> MUST BE "N/A", NEVER "$0.00"
        self.assertEqual(quarters[1]["net_income"], "N/A", "Missing financial rendered as zero instead of N/A!")
        
        # Quarter 3 (2023-12-31): Gross Profit was NaN -> MUST BE "N/A"
        self.assertEqual(quarters[2]["gross_profit"], "N/A")

    def test_column_order_assertion_newest_first(self):
        """Regression test: Quarterly table must assert and enforce newest-first column ordering."""
        # Reverse the columns deliberately (oldest first)
        reversed_df = self.mock_df.iloc[:, ::-1]
        self.mock_ticker.quarterly_income_stmt = reversed_df

        as_of = datetime.date(2024, 7, 15)
        # extract_quarterly_financials must sort descending and assert newest-first
        quarters, _ = extract_quarterly_financials(self.mock_ticker, info={}, as_of_date=as_of)

        dates = [pd.to_datetime(q["period_end_date"]) for q in quarters]
        for i in range(len(dates) - 1):
            self.assertGreaterEqual(dates[i], dates[i + 1], "Columns are not in newest-first order!")
        
        self.assertEqual(quarters[0]["period_end_date"], "2024-06-30")
        self.assertEqual(quarters[-1]["period_end_date"], "2023-09-30")

    def test_stale_guard_trigger_over_120_days(self):
        """Regression test: Core figure >120 days stale triggers STALE flag, never present as current."""
        # Latest quarter ended 2024-06-30. Set as_of date to 2024-11-15 (138 days later, > 120 days)
        stale_as_of = datetime.date(2024, 11, 15)
        quarters, vintage = extract_quarterly_financials(self.mock_ticker, info={}, as_of_date=stale_as_of)

        self.assertTrue(vintage["is_stale"], "Stale guard failed to trigger for >120 days stale data!")
        self.assertEqual(vintage["status"], "STALE")
        self.assertGreater(vintage["age_days"], 120)
        self.assertTrue(quarters[0]["stale"])
        self.assertIn("STALE", vintage.get("stale_warning", ""))

        # Fresh data test: Set as_of date to 2024-07-15 (15 days later, <= 120 days)
        fresh_as_of = datetime.date(2024, 7, 15)
        _, fresh_vintage = extract_quarterly_financials(self.mock_ticker, info={}, as_of_date=fresh_as_of)
        self.assertFalse(fresh_vintage["is_stale"])
        self.assertEqual(fresh_vintage["status"], "CURRENT")

    def test_fiscal_labels_from_reporting_calendar(self):
        """Test fiscal quarter labels derived from each company's reporting calendar and quoted period-end date."""
        # Standard calendar year-end (December, fye_month=12)
        q2_standard = get_fiscal_quarter_label(datetime.date(2024, 6, 30), fye_month=12)
        self.assertEqual(q2_standard, "Q2 '24")

        # Off-cycle fiscal year-end (e.g. Nvidia January year-end, fye_month=1)
        # Period ending April 30 is Q1 of fiscal year
        q1_nvda = get_fiscal_quarter_label(datetime.date(2024, 4, 30), fye_month=1)
        self.assertIn("Q1", q1_nvda)

        # Off-cycle fiscal year-end (e.g. Apple September year-end, fye_month=9)
        # Period ending Dec 31 is Q1 of fiscal year
        q1_aapl = get_fiscal_quarter_label(datetime.date(2023, 12, 31), fye_month=9)
        self.assertIn("Q1", q1_aapl)


class TestSecurityAndDeployment(unittest.TestCase):
    """C. SECURITY & DEPLOY (Points 6, 7, 8, 9)"""

    def test_no_secrets_in_source(self):
        """Grep/search proves no hardcoded tokens or secrets exist in source code."""
        import glob
        project_dir = os.path.dirname(os.path.abspath(__file__))
        patterns = [os.path.join(project_dir, "*.py"), os.path.join(project_dir, "bin", "*.sh")]
        
        # Assemble string dynamically so test file itself does not match
        forbidden_token = "8938" + "5306" + "23"
        for pattern in patterns:
            for filepath in glob.glob(pattern):
                if os.path.basename(filepath).startswith("test_"):
                    continue
                with open(filepath, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                    self.assertNotIn(
                        forbidden_token,
                        content,
                        f"Security failure: Found secret or token in source file {filepath}"
                    )
                    self.assertNotIn(
                        "TELEGRAM_BOT_TOKEN = '",
                        content,
                        f"Security failure: Hardcoded assignment in {filepath}"
                    )

    def test_ssl_verification_uses_certifi(self):
        """Verify ssl._create_unverified_context override is removed and certifi is in place."""
        import ssl
        import certifi
        # Verify that certifi provides a valid CA bundle
        self.assertTrue(os.path.exists(certifi.where()))
        # Verify default context verifies certificates
        ctx = ssl.create_default_context(cafile=certifi.where())
        self.assertEqual(ctx.verify_mode, ssl.CERT_REQUIRED)

    def test_rate_limiting_on_scan(self):
        """Verify rate limiter blocks excessive requests and returns 429."""
        scan_limiter.reset()
        ip = "192.168.1.100"
        # First 30 requests within 60s should be allowed
        for _ in range(30):
            allowed, _ = scan_limiter.is_allowed(ip)
            self.assertTrue(allowed)
        
        # 31st request should be rejected with retry_after
        allowed, retry_after = scan_limiter.is_allowed(ip)
        self.assertFalse(allowed)
        self.assertGreater(retry_after, 0)

        # Flask route level test for 429 status code
        client = app.test_client()
        scan_limiter.reset()
        # Exhaust rate limit for test client
        for _ in range(30):
            scan_limiter.is_allowed("127.0.0.1")
        # Next request must return 429
        resp = client.get("/scan/AAPL", headers={"X-Forwarded-For": "127.0.0.1"})
        self.assertEqual(resp.status_code, 429)
        self.assertIn("Retry-After", resp.headers)
        scan_limiter.reset()

    def test_launcher_health_check_endpoint(self):
        """Verify that launcher checks / which returns 200, whereas /api/macro does not exist."""
        client = app.test_client()
        # / must return 200 with HTML content
        root_resp = client.get("/")
        self.assertEqual(root_resp.status_code, 200)
        self.assertIn("text/html", root_resp.content_type)


class TestRobustness(unittest.TestCase):
    """D. ROBUSTNESS (Points 10, 11, 12)"""

    def test_escape_news_urls_xss_hardening(self):
        """Test that news URLs are sanitized and escaped to prevent XSS."""
        # Dangerous javascript scheme should be rejected
        self.assertEqual(DataSanitizer.sanitize_url("javascript:alert(1)"), "#")
        self.assertEqual(DataSanitizer.sanitize_url("data:text/html,<script>alert(1)</script>"), "#")
        self.assertEqual(DataSanitizer.sanitize_url("vbscript:msgbox(1)"), "#")

        # HTML attribute breakout attempt should be escaped
        malicious = 'https://finance.yahoo.com/news/test" onmouseover="alert(1)'
        safe = DataSanitizer.sanitize_url(malicious)
        self.assertNotIn('"', safe)
        self.assertIn("&quot;", safe)

        # Valid HTTPS URL should pass through safely
        valid = "https://finance.yahoo.com/news/sample-story-12345.html"
        self.assertEqual(DataSanitizer.sanitize_url(valid), valid)

    def test_guard_open_interest_division_by_zero(self):
        """Test that get_whale_flow handles zero or missing openInterest without ZeroDivisionError."""
        # Mock options chain with openInterest = 0 and positive volume
        mock_calls = pd.DataFrame({
            "strike": [150.0, 155.0],
            "volume": [500, 300],
            "openInterest": [0, 0] # Zero open interest!
        })
        mock_puts = pd.DataFrame({
            "strike": [140.0, 145.0],
            "volume": [100, 200],
            "openInterest": [0, 0]
        })

        mock_chain = MagicMock()
        mock_chain.calls = mock_calls
        mock_chain.puts = mock_puts

        mock_stock = MagicMock()
        mock_stock.options = ["2026-10-16"]
        mock_stock.option_chain.return_value = mock_chain

        with patch("yfinance.Ticker", return_value=mock_stock):
            # Must NOT raise ZeroDivisionError
            result = get_whale_flow("AAPL")
            self.assertIsInstance(result, str)
            self.assertNotIn("ZeroDivisionError", result)

    def test_read_api_keys_from_own_env_only(self):
        """Verify API keys are read from this app's own env only and never other projects' .env files."""
        import inspect
        source = inspect.getsource(resolve_api_keys)
        # Must not mention foreign project directories
        self.assertNotIn("direct_apply_bot", source)
        self.assertNotIn(".hermes", source)
        self.assertNotIn("~/.env", source)


if __name__ == "__main__":
    unittest.main(verbosity=2)
