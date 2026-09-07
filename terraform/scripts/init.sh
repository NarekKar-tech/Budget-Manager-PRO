#!/usr/bin/env bash
set -euo pipefail

LOG_FILE="/var/log/project-bootstrap.log"

echo "=== Budget Manager Pro bootstrap check ===" | sudo tee -a "$LOG_FILE"
echo "Timestamp: $(date -u +"%Y-%m-%dT%H:%M:%SZ")" | sudo tee -a "$LOG_FILE"
echo "Hostname: $(hostname)" | sudo tee -a "$LOG_FILE"

if command -v docker >/dev/null 2>&1; then
  echo "Docker: installed" | sudo tee -a "$LOG_FILE"
else
  echo "Docker: not installed" | sudo tee -a "$LOG_FILE"
fi

if docker compose version >/dev/null 2>&1; then
  echo "Docker Compose: available" | sudo tee -a "$LOG_FILE"
else
  echo "Docker Compose: unavailable" | sudo tee -a "$LOG_FILE"
fi

echo "Bootstrap check complete." | sudo tee -a "$LOG_FILE"
