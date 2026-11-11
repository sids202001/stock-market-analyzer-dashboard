#!/bin/bash
# ==============================================================================
# Stock Dashboard - Background Runner
# ==============================================================================
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$DIR"

export PYTHONUNBUFFERED=1
export PORT=8080

STDOUT_LOG="$DIR/service_stdout.log"
STDERR_LOG="$DIR/service_stderr.log"

export OBJC_DISABLE_INITIALIZE_FORK_SAFETY=YES
exec /Library/Frameworks/Python.framework/Versions/3.12/bin/python3 -m gunicorn --bind 127.0.0.1:${PORT:-8080} --workers 2 --worker-class sync --timeout 120 stock_app:app >> "$STDOUT_LOG" 2>> "$STDERR_LOG"
