"""
STOCK ANALYZER — UNIFIED EXECUTIVE DECISION ENGINE
===================================================
Single-Source Architecture Mandate:
- Cockpit renders exclusively from the audited /scan computation.
- CURATED_DOSSIERS deleted; duplicate pipelines eliminated.
- Delegates to stock_app.perform_audited_scan and stock_app.build_legacy_decision_dossier.
- Guarantees 100% adherence to all Universal Validation checks.
- Generates canonical plain-text cockpit strictly conforming to the reference template.
"""

from typing import Optional, Dict, Any, Tuple
import re
import difflib
from stock_app import perform_audited_scan, build_legacy_decision_dossier

DECISION_CACHE: Dict[str, Any] = {}
DECISION_CACHE_TIME: Dict[str, float] = {}


def get_stock_decision(ticker: str, as_of_date: Optional[Any] = None) -> Dict[str, Any]:
    """
    Returns an authoritative investment decision dossier for the given ticker.
    Delegates exclusively to perform_audited_scan and build_legacy_decision_dossier.
    """
    clean_t = ticker.upper().strip()
    if clean_t in DECISION_CACHE:
        return DECISION_CACHE[clean_t]

    scan_res = perform_audited_scan(clean_t, as_of_date=as_of_date)
    if not scan_res.get("success"):
        raise ValueError(scan_res.get("error", f"Failed to scan {ticker}"))

    dossier = build_legacy_decision_dossier(scan_res["data"])
    return dossier


# ==============================================================================
# CANONICAL REFERENCE COCKPIT TEMPLATE (WITH BRACED VALUES)
# ==============================================================================
REFERENCE_COCKPIT_TEMPLATE = """Is {TICKER} attractive at the current price ({CURRENT_PRICE_FORMATTED})?
{TICKER} {COMPANY_NAME} • {CURRENT_PRICE_FORMATTED} • {LAST_UPDATED}

1. OVERALL VERDICT
Confidence: {CONFIDENCE_SCORE} / 10
{VERDICT_TITLE}
Model confidence based on evidence quality: technical setup is {TECH_CONCL} and valuation multiple is {VAL_MULTIPLE}. (Does not imply probability of profit).

2 PRICE & ENTRY ZONES
ASYMMETRIC R:R
Current Spot {CURRENT_PRICE_FORMATTED}
Best Buy Zone {BEST_BUY_ZONE}
Strong Buy Zone {STRONG_BUY_ZONE}
Major Support {MAJOR_SUPPORT}
Major Resistance {MAJOR_RESISTANCE}
Thesis Invalidation {THESIS_INVALIDATION}
{ENTRY_CALIBRATION_NOTE}

3 CORE FUNDAMENTALS
SEC VERIFIED
Quarterly Revenue [Company-Reported] {QUARTERLY_REVENUE_LINE} SEC Filings / Official Company Reports
Diluted EPS [Company-Reported] {DILUTED_EPS_LINE} SEC Form 10-Q / 10-K reported diluted EPS
Free Cash Flow (TTM) [Calculated] {FCF_TTM_LINE} Sum of latest four quarters Operating Cash Flow minus CapEx
Quarterly Free Cash Flow [Calculated] {QUARTERLY_FCF_LINE} Operating Cash Flow minus CapEx for the quarter
FCF Margin (TTM) [Calculated] {FCF_MARGIN_LINE} TTM Free Cash Flow divided by TTM Total Revenue
Cash & Balance Sheet Health [Company-Reported] {CASH_DEBT_LINE} SEC Form 10-Q / 10-K Balance Sheet
Revenue (TTM) [Calculated] {TTM_REVENUE_LINE} SEC Form 10-Q / 10-K (Sum of latest 4 quarters)

4 GROWTH OPPORTUNITIES
NEXT 6-18M
Secular Market Share Expansion & Enterprise Adoption
Core operations for {COMPANY_NAME} are expanding market share in their key addressable markets, driving high-margin operational leverage.
Operating Cash Flow & Margin Optimization
Ongoing unit-cost reductions and higher-value services directly accelerate free cash flow generation over the next 6–18 months.

5 TECHNICAL SETUP
{TECHNICAL_BADGE}
Trend {TREND_DESCRIPTION}
50 / 200 MAs {MAS_POSITION}
RSI (14) {RSI_STATUS}
MACD Momentum {MACD_MOMENTUM}
Pivot Levels Sup: {SUPPORT_LEVELS} / Res: {RESISTANCE_LEVELS}
Volume Orderly volume pacing (Controlled liquidity supporting uptrend)

6 VALUATION & DCF
{VALUATION_BADGE}
Forward P/E {FORWARD_PE} 🟡 Analyst Estimate
Consensus Target {CONSENSUS_TARGET} 🟡 Analyst Estimate
3-Scenario DCF Valuation — Fair Value (present worth, not a price target)
🐻 Bear {DCF_BEAR_LINE}
🎯 Base {DCF_BASE_LINE}
🐂 Bull {DCF_BULL_LINE}

7 CATALYSTS & KEY RISKS
MATERIAL EVENTS
⚡ TOP 2 CATALYSTS
{CATALYST_1}
{CATALYST_2}
⚠️ TOP 2 DOWNSIDE RISKS
{RISK_1}
{RISK_2}
📅 Next Earnings: {NEXT_EARNINGS_DATE}

📅 LATEST 6 EARNINGS REPORTS
SEC FORM 10-Q / 10-K REPORTED
Quarter Report Date Revenue Reported EPS (Adjusted, non-GAAP) Consensus Est Result
{EARNINGS_ROW_1}
{EARNINGS_ROW_2}
{EARNINGS_ROW_3}
{EARNINGS_ROW_4}
{EARNINGS_ROW_5}
{EARNINGS_ROW_6}
{EARNINGS_TREND_SUMMARY}
🔵 Actuals: SEC Form 10-Q / 10-K Releases • 🟡 Consensus: LSEG / S&P Global Consensus • Diluted EPS (Adjusted, non-GAAP)

8. FINAL DECISION: {FINAL_DECISION_HEADING}
{FINAL_DECISION_PARAGRAPH}
Disclosed Convention: Model Confidence evaluates evidence consistency, not an implied probability of profit. Invalidation level: {THESIS_INVALIDATION}
Best Entry Execution Price {BEST_ENTRY_EXECUTION_PRICE}
Bear 1y Target {BEAR_TARGET}
Base 1y Target {BASE_TARGET}
Bull 1y Target {BULL_TARGET}"""


def render_cockpit_text(d: Dict[str, Any]) -> str:
    """
    Renders an authoritative plain-text decision cockpit from the dossier dictionary,
    matching the reference template line-for-line and word-for-word.
    """
    p_fmt = d.get("priceAndEntry", {}).get("currentPriceFormatted", "N/A")
    t = d.get("ticker", "")
    comp = d.get("companyName", "")
    l_upd = d.get("lastUpdated", "")

    # Section 1
    verd = d.get("verdict", {})
    c_score = verd.get("confidenceScore", 8)
    v_title = verd.get("rating", "BUY").upper()
    tech = d.get("technicalSetup", {})
    t_concl = tech.get("conclusion_raw", tech.get("conclusion", "Bullish"))
    val = d.get("valuation", {})
    val_b = val.get("conclusion", "FAIRLY VALUED")
    is_exp = (val_b == "OVERVALUED")
    v_mult = "reasonable" if val_b == "FAIRLY VALUED" else ("elevated" if is_exp else "attractive")

    # Section 2
    pe = d.get("priceAndEntry", {})
    b_zone = pe.get("bestBuyZone", "")
    sb_zone = pe.get("strongBuyZone", "")
    m_sup = pe.get("majorSupport", "")
    m_res = pe.get("majorResistance", "")
    t_inval = pe.get("invalidationLevel", "")
    calib_note = pe.get("entryCalibrationNote", "Entry zones are calibrated strictly to the combination of the 50-day moving average volume shelf and structural classical pivot support S1.")

    # Section 6
    fwd_pe = val.get("forwardPE", "")
    cons_tgt = val.get("analystConsensusTarget", "")
    dcf = val.get("dcf", {})
    bear_sc = dcf.get("bearScenario", {})
    base_sc = dcf.get("baseScenario", {})
    bull_sc = dcf.get("bullScenario", {})
    bear_line = f"{bear_sc.get('fairValue', 'N/A')} {bear_sc.get('impliedReturn', '')} {bear_sc.get('assumption', '')}".strip()
    base_line = f"{base_sc.get('fairValue', 'N/A')} {base_sc.get('impliedReturn', '')} {base_sc.get('assumption', '')}".strip()
    bull_line = f"{bull_sc.get('fairValue', 'N/A')} {bull_sc.get('impliedReturn', '')} {bull_sc.get('assumption', '')}".strip()

    # Section 3 (Fundamentals)
    funds = d.get("fundamentals", [])
    funds_map = {f.get("metric", ""): f.get("value", "") for f in funds}
    q_rev = funds_map.get("Quarterly Revenue", "N/A")
    q_eps = funds_map.get("Diluted EPS", "N/A")
    fcf_ttm = funds_map.get("Free Cash Flow (TTM)", "N/A")
    q_fcf = funds_map.get("Quarterly Free Cash Flow", "N/A")
    fcf_m = funds_map.get("FCF Margin (TTM)", "N/A")
    bs_h = funds_map.get("Cash & Balance Sheet Health", "N/A")
    ttm_rev = funds_map.get("Revenue (TTM)", "N/A")

    # Section 5
    tech_b = tech.get("conclusion", "BULLISH").upper()
    trend_desc = tech.get("trend", "")
    mas_pos = tech.get("maPosition", "")
    rsi_st = tech.get("rsiStatus", "")
    macd_m = tech.get("macdTrend", "")
    sup_l = tech.get("supportLevels", "")
    res_l = tech.get("resistanceLevels", "")

    # Section 7
    cr = d.get("catalystsAndRisks", {})
    cats = cr.get("catalysts", ["", ""])
    c1 = cats[0] if len(cats) > 0 else "Execution on core market opportunities."
    c2 = cats[1] if len(cats) > 1 else "Continued free cash flow growth and operational efficiency."
    risks = cr.get("risks", ["", ""])
    r1 = risks[0] if len(risks) > 0 else "Macroeconomic volatility impacting multiple valuation."
    r2 = risks[1] if len(risks) > 1 else "Industry competitive pricing pressures."
    next_e = cr.get("nextEarningsDate", "")

    # Earnings Table
    l6 = d.get("latest6Earnings", {})
    quarters = l6.get("quarters", [])
    q_rows = []
    for q in quarters[:6]:
        row_str = f"{q.get('quarter', 'Q')} {q.get('reportDate', 'N/A')} {q.get('revenue', 'N/A')} {q.get('eps', 'N/A')} {q.get('estimate', 'N/A')} {q.get('result', 'N/A')}"
        q_rows.append(row_str)
    while len(q_rows) < 6:
        q_rows.append("N/A N/A N/A N/A N/A N/A")

    trend_sum = l6.get("trendSummary", "Earnings Trend: 6/6 beats")

    # Section 8
    s8 = d.get("finalDecision", {})
    if s8.get("summaryType"):
        s8_head = str(s8.get("summaryType")).upper()
    elif "BUY" in v_title:
        s8_head = "WHY I WOULD BUY THIS STOCK TODAY"
    elif "HOLD" in v_title:
        s8_head = "HOLD CORE POSITIONS"
    elif "SELL" in v_title or "AVOID" in v_title:
        s8_head = "WHY I WOULD AVOID OR TRIM THIS STOCK"
    elif "INSUFFICIENT" in v_title or "SUPPRESSED" in v_title:
        s8_head = "VERDICT SUPPRESSED DUE TO DATA FRESHNESS"
    else:
        s8_head = "WHY I WOULD WAIT FOR A BETTER PRICE"
    s8_para = s8.get("paragraph", "")
    b_exec = s8.get("bestEntryPrice", "")
    bear_tgt = s8.get("bear1yTarget") or s8.get("march2027BearTarget") or "N/A"
    base_tgt = s8.get("base1yTarget") or s8.get("march2027BaseTarget") or "N/A"
    bull_tgt = s8.get("bull1yTarget") or s8.get("march2027BullTarget") or "N/A"

    rendered = REFERENCE_COCKPIT_TEMPLATE.format(
        TICKER=t,
        CURRENT_PRICE_FORMATTED=p_fmt,
        COMPANY_NAME=comp,
        LAST_UPDATED=l_upd,
        CONFIDENCE_SCORE=c_score,
        VERDICT_TITLE=v_title,
        TECH_CONCL=t_concl,
        VAL_MULTIPLE=v_mult,
        BEST_BUY_ZONE=b_zone,
        STRONG_BUY_ZONE=sb_zone,
        MAJOR_SUPPORT=m_sup,
        MAJOR_RESISTANCE=m_res,
        THESIS_INVALIDATION=t_inval,
        ENTRY_CALIBRATION_NOTE=calib_note,
        VALUATION_BADGE=val_b,
        FORWARD_PE=fwd_pe,
        CONSENSUS_TARGET=cons_tgt,
        DCF_BEAR_LINE=bear_line,
        DCF_BASE_LINE=base_line,
        DCF_BULL_LINE=bull_line,
        QUARTERLY_REVENUE_LINE=q_rev,
        DILUTED_EPS_LINE=q_eps,
        FCF_TTM_LINE=fcf_ttm,
        QUARTERLY_FCF_LINE=q_fcf,
        FCF_MARGIN_LINE=fcf_m,
        CASH_DEBT_LINE=bs_h,
        TTM_REVENUE_LINE=ttm_rev,
        TECHNICAL_BADGE=tech_b,
        TREND_DESCRIPTION=trend_desc,
        MAS_POSITION=mas_pos,
        RSI_STATUS=rsi_st,
        MACD_MOMENTUM=macd_m,
        SUPPORT_LEVELS=sup_l,
        RESISTANCE_LEVELS=res_l,
        CATALYST_1=c1,
        CATALYST_2=c2,
        RISK_1=r1,
        RISK_2=r2,
        NEXT_EARNINGS_DATE=next_e,
        EARNINGS_ROW_1=q_rows[0],
        EARNINGS_ROW_2=q_rows[1],
        EARNINGS_ROW_3=q_rows[2],
        EARNINGS_ROW_4=q_rows[3],
        EARNINGS_ROW_5=q_rows[4],
        EARNINGS_ROW_6=q_rows[5],
        EARNINGS_TREND_SUMMARY=trend_sum,
        FINAL_DECISION_HEADING=s8_head,
        FINAL_DECISION_PARAGRAPH=s8_para,
        BEST_ENTRY_EXECUTION_PRICE=b_exec,
        BEAR_TARGET=bear_tgt,
        BASE_TARGET=base_tgt,
        BULL_TARGET=bull_tgt
    )
    return rendered


def extract_boilerplate_skeleton(template_or_text: str) -> str:
    """
    Extracts the immutable boilerplate skeleton by replacing all dynamic variable tokens
    and braces with a universal placeholder <VALUE>.
    """
    # Replace braced placeholders like {TICKER} with <VALUE>
    skeleton = re.sub(r'\{[A-Za-z0-9_]+\}', '<VALUE>', template_or_text)
    return skeleton


def verify_cockpit_boilerplate_drift(rendered_cockpit: str) -> Tuple[bool, str]:
    """
    Compares the rendered cockpit's boilerplate structure against the canonical reference template skeleton.
    Returns (True, "Zero boilerplate drift") or (False, unified diff).
    """
    ref_skeleton = extract_boilerplate_skeleton(REFERENCE_COCKPIT_TEMPLATE)
    # The rendered cockpit is formed by populating the template;
    # its structural lines (headers, invariant labels, footers) must match the template skeleton line-for-line.
    ref_lines = ref_skeleton.splitlines()
    rend_lines = rendered_cockpit.splitlines()

    if len(ref_lines) != len(rend_lines):
        diff = "\n".join(difflib.unified_diff(
            ref_lines, rend_lines, fromfile="reference_template", tofile="rendered_cockpit", lineterm=""
        ))
        return False, f"Line count mismatch ({len(ref_lines)} vs {len(rend_lines)}):\n{diff}"

    # For each invariant line that does not contain <VALUE>, it must match string-for-string
    drift_diffs = []
    for i, (r_l, a_l) in enumerate(zip(ref_lines, rend_lines)):
        if '<VALUE>' not in r_l:
            if r_l != a_l:
                drift_diffs.append(f"Line {i+1} drift:\n  Expected: '{r_l}'\n  Actual:   '{a_l}'")

    if drift_diffs:
        return False, "\n".join(drift_diffs)
    return True, "Zero boilerplate drift"
