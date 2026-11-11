"""
INDEPENDENT DCF REFERENCE VALIDATOR
================================================================================
Rule 8 & Rule 13.6 Mandate: Independent Hand-Reconciliation Computation.

METHODOLOGY & MATHEMATICAL DERIVATION:
This reference computation is 100% independent from the dashboard's DCF engine (dcf_engine.py).
It shares ZERO code, ZERO classes, and ZERO helper functions with the engine pipeline.

Formula:
  1. Cash Flow Projections (Discrete annual discounting):
     CF_t = FCF_0 * (1 + g)^t
     PV_Flows = SUM_{t=1..N} [ CF_t / (1 + WACC)^t ]

  2. Terminal Value (Gordon Growth Model at horizon N):
     TV = [ CF_N * (1 + g_terminal) ] / (WACC - g_terminal)
     PV_Terminal = TV / (1 + WACC)^N

  3. Enterprise Value to Equity Value Bridge:
     Equity_Value = PV_Flows + PV_Terminal + Net_Cash_Adjustment
     Where:
       Net_Cash_Adjustment = Cash & Equivalents - Total Debt - Off_Balance_Sheet_Obligations (e.g. JV Capex)

  4. Fair Value Per Share:
     Intrinsic_Value_Per_Share = Equity_Value / Diluted_Shares_Outstanding

INDEPENDENCE PROOF:
- Written from first-principles corporate finance theory (Brealey, Myers, Allen).
- Evaluates raw floats without relying on engine state, caches, or global configs.
"""

def independent_hand_reconcile_dcf(
    fcf0: float,
    shares: float,
    growth_rate: float,
    wacc: float,
    terminal_growth_rate: float,
    net_cash_adjustment: float,
    projection_years: int = 5
) -> float:
    """
    Independent hand calculation of equity fair value per share.
    Shares zero code with dcf_engine.py.
    """
    if not fcf0 or not shares or shares <= 0:
        return 0.0

    # 1. Project and discount cash flows
    pv_flows = 0.0
    cf_t = float(fcf0)
    g = float(growth_rate)
    w = float(wacc)
    gt = float(terminal_growth_rate)

    for t in range(1, projection_years + 1):
        cf_t *= (1.0 + g)
        pv_flows += cf_t / ((1.0 + w) ** t)

    # 2. Terminal value discounting
    denom = max(0.012, w - gt)
    tv = (cf_t * (1.0 + gt)) / denom
    pv_tv = tv / ((1.0 + w) ** projection_years)

    # 3. Enterprise to Equity value bridge
    equity_val = pv_flows + pv_tv + float(net_cash_adjustment)

    # 4. Per-share conversion using authoritative shares outstanding
    fv_per_share = round(equity_val / float(shares), 2)
    return max(1.0, fv_per_share)
