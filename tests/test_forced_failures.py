"""
Forced-Failure Integrity & DCF Circuit-Breaker Test Suite
Verifies that the integrity badge NEVER reads PASS when:
  1. A stale filing (>120 days old) is injected.
  2. A GAAP vs non-GAAP EPS mismatch is injected.
  3. A diverged DCF (>50% above OR below spot) is injected.
  4. Missing valuation data (Forward P/E or analyst targets unavailable) is injected.
Also verifies independent hand-reconciliation of DCF outputs within 5%.
"""

import os
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import dcf_engine
import stock_app


def test_forced_failure_stale_filing():
    res = stock_app.compute_integrity_audit(
        ticker="MSFT",
        scan_data={"data_vintage": {"latest_filing_date": "2024-10-30", "age_days": 755}},
        is_stale=True,
        stale_warning="Latest SEC Form 10-Q filed 2024-10-30 (755 days old > 120-day limit)",
        dcf_scen=None,
        cross_val={"internal_contradictions": []},
        rsi_val=52.0,
        next_earn_str="January 27, 2027",
        b_high=480.0,
        s1=470.0,
        sma50=485.0,
    )
    assert res["status"] == "FLAGGED", f"Expected FLAGGED on stale filing, got {res}"
    assert "freshness" in res["failed_checks"]
    assert "PASS (" not in res["badge_text"]


def test_forced_failure_gaap_non_gaap_mismatch():
    fake_funds = [
        {"metric": "Diluted EPS", "value": "$4.89 [Adjusted, non-GAAP] (+31.5% YoY vs $3.72 in Q1 '26)"},
        {"metric": "Cash & Balance Sheet Health", "value": "Cash: $64.51B | Total Debt: $35.48B"},
    ]
    fake_quarters = [
        {"quarter": "Q1 FY2027", "eps": "$4.89", "revenue": "$92.28B"},
        {"quarter": "Q1 FY2026", "eps": "$4.13", "revenue": "$77.67B"},
    ]
    contradictions = stock_app.audit_internal_consistency(
        funds_list=fake_funds,
        table_quarters=fake_quarters,
        delta_line="",
        fcf_info={"owner_fcf": 59.96e9},
        analyst_target_str="$637.36 (+29.4%)",
        analyst_source_str="[Analyst Estimate] Wall Street Consensus (58 analysts)",
    )
    assert any(c["check"] == "yoy_eps_mismatch" for c in contradictions), contradictions
    res = stock_app.compute_integrity_audit(
        ticker="MSFT",
        scan_data={"data_vintage": {"latest_filing_date": "2026-10-28", "age_days": 27}},
        is_stale=False,
        stale_warning=None,
        dcf_scen=None,
        cross_val={"internal_contradictions": contradictions},
        rsi_val=52.0,
        next_earn_str="January 27, 2027",
        b_high=480.0,
        s1=470.0,
        sma50=485.0,
    )
    assert res["status"] == "FLAGGED", f"Expected FLAGGED on GAAP/non-GAAP mismatch, got {res}"
    assert "cross_validation" in res["failed_checks"]
    assert "PASS (" not in res["badge_text"]


def test_forced_failure_diverged_dcf_downside_and_upside():
    # Downside >50% divergence (e.g., Base ~$143 vs spot $492.50 = -71%)
    scen_low = dcf_engine.compute_fundamental_dcf_scenarios(
        owner_fcf=59.96e9,
        shares=7.426e9,
        beta=1.0,
        cash=20.28e9,
        debt=31.09e9,
        base_growth=0.08,
        price=492.50,
    )
    assert scen_low is not None
    assert scen_low["circuit_breaker_tripped"] is True
    assert scen_low["base"]["fair_value"] is None
    assert scen_low["base"]["fair_value_str"] == "Model unreliable — do not use"

    res = stock_app.compute_integrity_audit(
        ticker="MSFT",
        scan_data={"data_vintage": {"latest_filing_date": "2026-10-28", "age_days": 27}},
        is_stale=False,
        stale_warning=None,
        dcf_scen=scen_low,
        cross_val={"internal_contradictions": []},
        rsi_val=52.0,
        next_earn_str="January 27, 2027",
        b_high=480.0,
        s1=470.0,
        sma50=485.0,
    )
    assert res["status"] == "FLAGGED", f"Expected FLAGGED on diverged DCF, got {res}"
    assert "dcf_circuit_breaker" in res["failed_checks"]
    assert "PASS (" not in res["badge_text"]

    # Upside >50% divergence
    scen_high = dcf_engine.compute_fundamental_dcf_scenarios(
        owner_fcf=120e9,
        shares=2e9,
        beta=1.0,
        cash=50e9,
        debt=0.0,
        base_growth=0.20,
        price=100.0,
    )
    assert scen_high is not None
    assert scen_high["circuit_breaker_tripped"] is True


def test_forced_failure_missing_valuation_data():
    contradictions = [
        {"check": "missing_forward_pe", "detail": "Forward P/E unavailable — Wall Street consensus returned no data"},
        {"check": "missing_analyst_targets", "detail": "Analyst price targets unavailable — analyst consensus returned no data"},
    ]
    res = stock_app.compute_integrity_audit(
        ticker="MSFT",
        scan_data={"data_vintage": {"latest_filing_date": "2026-10-28", "age_days": 27}},
        is_stale=False,
        stale_warning=None,
        dcf_scen=None,
        cross_val={"internal_contradictions": contradictions},
        rsi_val=52.0,
        next_earn_str="January 27, 2027",
        b_high=480.0,
        s1=470.0,
        sma50=485.0,
    )
    assert res["status"] == "FLAGGED"
    assert "cross_validation" in res["failed_checks"]


def test_dcf_hand_reconciliation_within_5pct():
    scen = dcf_engine.compute_fundamental_dcf_scenarios(
        owner_fcf=59.96e9,
        shares=7.426e9,
        beta=1.05,
        cash=64.51e9,
        debt=35.48e9,
        base_growth=0.188,
        price=492.50,
        ticker="MSFT",
        ttm_ocf=195.88e9,
        ttm_capex=135.92e9,
    )
    assert scen is not None
    assert scen["capex_normalized"] is True
    assert scen["circuit_breaker_tripped"] is False
    for sc in ("bear", "base", "bull"):
        assert scen[sc]["hand_reconciled"] is True
        assert scen[sc]["hand_reconcile_diff_pct"] <= 5.0


if __name__ == "__main__":
    test_forced_failure_stale_filing()
    test_forced_failure_gaap_non_gaap_mismatch()
    test_forced_failure_diverged_dcf_downside_and_upside()
    test_forced_failure_missing_valuation_data()
    test_dcf_hand_reconciliation_within_5pct()
    print("ALL FORCED-FAILURE & HAND-RECONCILIATION TESTS PASSED!")
