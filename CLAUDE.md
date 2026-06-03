# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Crack Detection is a full-stack application for processing road/surface images to detect and classify cracks. Users upload CSV files containing image metadata (with GPS coordinates), which are processed by the backend. Results are displayed on a dashboard with charts and an interactive Mapbox map.

## Architecture

**Monorepo** with three Docker services orchestrated via `docker-compose.yml` at the root:

- **`backend/`** — Python FastAPI API (async, PostgreSQL via SQLAlchemy 2.0 + asyncpg)
- **`frontend/`** — Next.js 16 (React 19, App Router, Tailwind CSS 4, shadcn/ui, Zustand, Mapbox GL)
- **`db`** — PostgreSQL 16 (Alpine, Docker-only)

### Backend (`backend/`)

- **Framework**: FastAPI with async SQLAlchemy 2.0 (asyncpg driver)
- **Python**: 3.11+, strict mypy, ruff for linting
- **API prefix**: `/api/v1` (configured in `src/core/config.py`)
- **Module structure**: Domain-based (`src/auth/`, `src/users/`, `src/core/`, `src/db/`)
- **DB base model**: `src/db/base.py` — all models inherit `Base` which provides `id`, `created_at`, `updated_at`
- **Session management**: `src/db/session.py` — async session with auto-commit/rollback
- **Settings**: pydantic-settings `Settings` class in `src/core/config.py`, loaded from env vars / `.env`
- **Auth**: JWT (python-jose) with bcrypt password hashing
- **Migrations**: Alembic (`backend/alembic/`)

### Frontend (`frontend/`)

- **Framework**: Next.js 16.1.6, React 19, TypeScript 5
- **Package manager**: Bun (see `bun.lock`)
- **Route groups**: `(auth)` for login, `(dashboard)` for main app pages (dashboard, map, upload)
- **Layout**: `(dashboard)/layout.tsx` wraps pages in `MainLayout` (sidebar + header)
- **State**: Zustand stores in `src/store/` (jobs-store, results-store)
- **API client**: Custom fetch wrapper in `src/lib/api/client.ts` with retry logic
- **Types**: Shared types in `src/types/index.ts` (ProcessingJob, CrackResult, DashboardStats, CsvRow)
- **Map**: Mapbox GL via `src/components/map/`
- **Charts**: [Recharts](https://recharts.org/) (`recharts` in `package.json`); shared theme in `src/lib/charts/config.ts`; dashboard examples in `src/components/dashboard/crack-type-chart.tsx` (bar) and `severity-chart.tsx` (donut). `next.config.ts` lists `recharts` under `experimental.optimizePackageImports`.
- **Fonts**: Outfit (sans), JetBrains Mono (mono)
- **UI**: shadcn/ui components in `src/components/ui/`

## Commands

### Full Stack (Docker)

```bash
./scripts/dev.sh       # Fresh build + start with live logs (resets DB)
./scripts/start.sh     # Fresh build (no-cache) + start detached, waits for health
./scripts/stop.sh      # Stop containers (preserves DB volume)
docker compose logs -f  # Tail all logs
```

### Backend Only

```bash
cd backend
pip install -r requirements.txt              # Install dependencies
uvicorn src.main:app --reload --port 8000    # Run dev server
ruff check src/                              # Lint
mypy src/                                    # Type check
pytest                                       # Run all tests
pytest tests/test_health.py -v               # Run single test file
alembic upgrade head                         # Run migrations
alembic revision --autogenerate -m "msg"     # Create migration
```

### Frontend Only

```bash
cd frontend
bun install            # Install dependencies
bun dev                # Dev server on :3000
bun run build          # Production build
bun run lint           # ESLint
```

## Key URLs (when running)

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/api/v1/docs
- Health Check: http://localhost:8000/health
- Database: localhost:5432 (postgres/postgres/crack_detection)

## Environment Variables

- Root `.env` and `backend/.env` for backend config (DATABASE_URL, SECRET_KEY, etc.)
- `frontend/.env.local` for frontend config (NEXT_PUBLIC_API_URL, NEXT_PUBLIC_MAPBOX_TOKEN)
- Docker Compose sets its own env vars — check `docker-compose.yml` for the Docker-specific values

## Context

`Context/` directory contains reference CSV data (e.g., Ladybug camera exports) used as sample input for the upload/processing pipeline.
