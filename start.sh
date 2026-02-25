#!/usr/bin/env bash
set -euo pipefail

HOST=${HOST:-127.0.0.1}
PORT=${PORT:-3000}
LOG=${LOG:-/home/ubuntu/clawd/logs/adam-landing.log}
PIDFILE=${PIDFILE:-/home/ubuntu/clawd/logs/adam-landing.pid}

cd /home/ubuntu/clawd/apps/adam-landing

health_check() {
  # Keep it simple: root should return 200.
  # Use a slightly longer timeout; Next dev can spike CPU during rebuilds.
  curl -fsS --max-time 5 "http://${HOST}:${PORT}/" >/dev/null 2>&1
}

health_check_retry() {
  health_check && return 0
  sleep 0.4
  health_check && return 0
  return 1
}

# If something is listening and healthy, we're done.
if lsof -iTCP:${PORT} -sTCP:LISTEN -nP >/dev/null 2>&1; then
  if health_check_retry; then
    exit 0
  fi

  # Something is up but unhealthy; attempt a restart.
  # Kill whatever is bound to the port (most reliable).
  pid=$(lsof -tiTCP:${PORT} -sTCP:LISTEN -nP | head -n 1 || true)
  if [ -n "${pid}" ]; then
    kill "${pid}" >/dev/null 2>&1 || true
  fi

  # Also kill the last recorded PID if present (may be the npm wrapper).
  if [ -f "${PIDFILE}" ]; then
    pid2=$(cat "${PIDFILE}" 2>/dev/null || true)
    if [ -n "${pid2}" ]; then
      kill "${pid2}" >/dev/null 2>&1 || true
    fi
  fi

  # Give the port a moment to free.
  for i in 1 2 3 4 5 6 7 8 9 10; do
    if ! lsof -iTCP:${PORT} -sTCP:LISTEN -nP >/dev/null 2>&1; then
      break
    fi
    sleep 0.3
  done
fi

# Start detached
nohup npm run start -- --hostname ${HOST} --port ${PORT} >>"${LOG}" 2>&1 &
echo $! >"${PIDFILE}"
