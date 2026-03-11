#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

echo "=========================================="
echo "  Stopping Crack Detection..."
echo "=========================================="

# Stop containers and remove orphans
docker compose down --remove-orphans

echo ""
echo "  All containers stopped."
echo "  Note: Database volume preserved."
echo "  To also remove data: docker compose down -v"
echo "=========================================="
