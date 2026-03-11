#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="crack-detection"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

echo "=========================================="
echo "  $PROJECT_NAME - Dev Mode (with logs)"
echo "=========================================="

# ── Stop any running containers ──
echo ""
echo "[1/3] Stopping any running containers..."
docker compose down --remove-orphans 2>/dev/null || true

# ── Remove old volumes (fresh DB every time) ──
echo "[2/3] Removing old volumes and cache..."
docker compose down -v 2>/dev/null || true

# ── Build and start with live logs ──
echo "[3/3] Building and starting (logs attached)..."
echo ""
docker compose up --build
