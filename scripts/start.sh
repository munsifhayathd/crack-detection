#!/usr/bin/env bash
set -euo pipefail

PROJECT_NAME="crack-detection"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

echo "=========================================="
echo "  $PROJECT_NAME - Fresh Start"
echo "=========================================="

# ── Stop any running containers ──
echo ""
echo "[1/4] Stopping any running containers..."
docker compose down --remove-orphans 2>/dev/null || true

# ── Remove old volumes (fresh DB every time) ──
echo "[2/4] Removing old volumes and cache..."
docker compose down -v 2>/dev/null || true

# ── Rebuild images from scratch (no cache) ──
echo "[3/4] Building images (no cache)..."
docker compose build --no-cache

# ── Start all services ──
echo "[4/4] Starting all services..."
docker compose up -d

echo ""
echo "=========================================="
echo "  Waiting for services to be healthy..."
echo "=========================================="

# Wait for DB
echo -n "  DB: "
for i in $(seq 1 30); do
    if docker compose exec -T db pg_isready -U postgres > /dev/null 2>&1; then
        echo "ready"
        break
    fi
    if [ "$i" -eq 30 ]; then
        echo "TIMEOUT"
        echo "ERROR: Database did not start in time."
        docker compose logs db
        exit 1
    fi
    sleep 1
done

# Wait for Backend
echo -n "  Backend: "
for i in $(seq 1 60); do
    if curl -sf http://localhost:8000/health > /dev/null 2>&1; then
        echo "ready"
        break
    fi
    if [ "$i" -eq 60 ]; then
        echo "TIMEOUT"
        echo "ERROR: Backend did not start in time."
        docker compose logs backend
        exit 1
    fi
    sleep 1
done

# Wait for Frontend
echo -n "  Frontend: "
for i in $(seq 1 90); do
    if curl -sf http://localhost:3000 > /dev/null 2>&1; then
        echo "ready"
        break
    fi
    if [ "$i" -eq 90 ]; then
        echo "TIMEOUT"
        echo "WARNING: Frontend may still be compiling. Check logs with: docker compose logs frontend"
        break
    fi
    sleep 1
done

echo ""
echo "=========================================="
echo "  All services are running!"
echo "=========================================="
echo ""
echo "  Frontend:  http://localhost:3000"
echo "  Backend:   http://localhost:8000"
echo "  API Docs:  http://localhost:8000/api/v1/docs"
echo "  Database:  localhost:5432"
echo ""
echo "  Logs:      docker compose logs -f"
echo "  Stop:      ./scripts/stop.sh"
echo "=========================================="
