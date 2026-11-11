"""
Authoritative Fallback & Provenance Audit Logger
================================================
Rule 1 Mandate:
- Source hierarchy: SEC EDGAR / company releases > named providers (yfinance, LSEG, S&P Global) > computed values (with formula).
- If a figure cannot be sourced, display N/A — never a guess.
- Every fallback is written to an audit log (source, timestamp, value, ticker, reason) that is viewable.
"""

import os
import json
import logging
from datetime import datetime, timezone
from typing import Dict, Any, List, Optional

logger = logging.getLogger("audit_logger")

AUDIT_LOG_FILE = os.path.join(os.path.dirname(__file__), "audit_fallback_log.jsonl")

# In-memory buffer of recent fallback events
_FALLBACK_EVENTS: List[Dict[str, Any]] = []
_MAX_BUFFER_SIZE = 1000


def log_fallback(
    ticker: str,
    metric: str,
    fallback_source: str,
    value: Any,
    intended_source: str = "SEC EDGAR",
    reason: str = "Primary source unavailable or unparsed"
) -> Dict[str, Any]:
    """
    Records a data fallback occurrence into the audit log.
    Captures: ticker, metric, intended_source, fallback_source, timestamp, value, reason.
    """
    event = {
        "ticker": ticker.upper().strip(),
        "metric": metric,
        "intended_source": intended_source,
        "fallback_source": fallback_source,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "value": str(value) if value is not None else "N/A",
        "reason": reason
    }

    _FALLBACK_EVENTS.append(event)
    if len(_FALLBACK_EVENTS) > _MAX_BUFFER_SIZE:
        _FALLBACK_EVENTS.pop(0)

    try:
        with open(AUDIT_LOG_FILE, "a", encoding="utf-8") as f:
            f.write(json.dumps(event) + "\n")
    except Exception as e:
        logger.error(f"Failed to append to audit log file: {e}")

    return event


def get_audit_log(ticker: Optional[str] = None, limit: int = 100) -> List[Dict[str, Any]]:
    """
    Retrieves the most recent fallback audit records, optionally filtered by ticker.
    """
    events = _FALLBACK_EVENTS
    if not events and os.path.exists(AUDIT_LOG_FILE):
        try:
            with open(AUDIT_LOG_FILE, "r", encoding="utf-8") as f:
                lines = f.readlines()
                for line in lines[-limit:]:
                    try:
                        events.append(json.loads(line.strip()))
                    except Exception:
                        pass
        except Exception:
            pass

    if ticker:
        t_clean = ticker.upper().strip()
        filtered = [e for e in events if e.get("ticker") == t_clean]
        return filtered[-limit:]

    return events[-limit:]


def clear_audit_log() -> None:
    """Clears in-memory and on-disk fallback log for test isolation."""
    global _FALLBACK_EVENTS
    _FALLBACK_EVENTS = []
    if os.path.exists(AUDIT_LOG_FILE):
        try:
            os.remove(AUDIT_LOG_FILE)
        except Exception:
            pass
