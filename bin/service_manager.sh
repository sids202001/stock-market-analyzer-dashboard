#!/bin/bash
# ==============================================================================
# Stock Dashboard - Service & Daemon Manager
# ==============================================================================

SERVICE_NAME="com.siddhesh.stockdashboard"
PLIST_PATH="$HOME/Library/LaunchAgents/${SERVICE_NAME}.plist"
PROJECT_DIR="/Users/siddheshsawant/stock-dashboard"
TARGET_URL="http://localhost:8080"
CHROME_APP="/Applications/Google Chrome.app"

status() {
    echo "🔍 Checking Stock Dashboard daemon status..."
    if curl -s -m 2 "$TARGET_URL" >/dev/null 2>&1; then
        PID=$(lsof -t -i :8080 2>/dev/null | head -n 1)
        echo "🟢 Stock Dashboard is ACTIVE and RUNNING (HTTP 200)"
        echo "   PID: ${PID:-Unknown}"
        echo "   URL: $TARGET_URL"
        if launchctl list | grep -q "$SERVICE_NAME"; then
            echo "   LaunchAgent: Registered ($SERVICE_NAME)"
        else
            echo "   LaunchAgent: Not loaded in launchctl (standalone process)"
        fi
        return 0
    else
        echo "🔴 Stock Dashboard is STOPPED (port 8080 not responding)"
        return 1
    fi
}

start() {
    echo "🚀 Starting Stock Dashboard..."
    if status >/dev/null 2>&1; then
        echo "ℹ️ Stock Dashboard is already running at $TARGET_URL"
        return 0
    fi

    if [ -f "$PLIST_PATH" ]; then
        launchctl bootstrap "gui/$(id -u)" "$PLIST_PATH" 2>/dev/null || \
        launchctl kickstart -k "gui/$(id -u)/$SERVICE_NAME" 2>/dev/null || \
        launchctl load "$PLIST_PATH" 2>/dev/null
    else
        nohup "$PROJECT_DIR/bin/run_app.sh" >/dev/null 2>&1 &
    fi

    echo "⏳ Waiting for service to become responsive..."
    for i in {1..20}; do
        if curl -s -m 1 "$TARGET_URL" >/dev/null 2>&1; then
            echo "✅ Stock Dashboard started successfully!"
            status
            return 0
        fi
        sleep 0.5
    done

    echo "⚠️ Started process, but service did not respond within 10 seconds. Check logs:"
    echo "   tail -n 20 $PROJECT_DIR/service_stderr.log"
    return 1
}

stop() {
    echo "🛑 Stopping Stock Dashboard..."
    if [ -f "$PLIST_PATH" ]; then
        launchctl bootout "gui/$(id -u)/$SERVICE_NAME" 2>/dev/null || \
        launchctl unload "$PLIST_PATH" 2>/dev/null
    fi

    PID=$(lsof -t -i :8080 2>/dev/null)
    if [ -n "$PID" ]; then
        echo "Killing PID(s): $PID"
        kill $PID 2>/dev/null || true
        sleep 1
        kill -9 $PID 2>/dev/null || true
    fi

    if ! curl -s -m 1 "$TARGET_URL" >/dev/null 2>&1; then
        echo "✅ Stock Dashboard successfully stopped."
        return 0
    else
        echo "⚠️ Port 8080 still open. Check processes."
        return 1
    fi
}

restart() {
    stop
    sleep 1
    start
}

open_app() {
    start >/dev/null 2>&1
    echo "🖥️ Opening AI Stock Analysis Dashboard window..."
    if [ -d "$CHROME_APP" ]; then
        open -n -a "$CHROME_APP" --args --app="$TARGET_URL" 2>/dev/null || \
        open -a "$CHROME_APP" "$TARGET_URL" 2>/dev/null || \
        open "$TARGET_URL"
    else
        open "$TARGET_URL"
    fi
}

logs() {
    echo "📋 Recent stdout:"
    tail -n 15 "$PROJECT_DIR/service_stdout.log" 2>/dev/null || echo "(Empty stdout log)"
    echo ""
    echo "⚠️ Recent stderr:"
    tail -n 15 "$PROJECT_DIR/service_stderr.log" 2>/dev/null || echo "(Empty stderr log)"
}

case "$1" in
    start)
        start
        ;;
    stop)
        stop
        ;;
    restart)
        restart
        ;;
    status)
        status
        ;;
    open)
        open_app
        ;;
    logs)
        logs
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|open|logs}"
        exit 1
        ;;
esac
