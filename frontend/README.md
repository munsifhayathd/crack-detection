# Crack Detection Frontend

Next.js 16 (App Router) UI for the Crack Detection application.

## Getting Started

```bash
bun install   # or: npm install
bun dev       # http://localhost:3000
```

Set `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local` (see root `CLAUDE.md` for defaults).

## Data visualization (Recharts)

Dashboard charts use [Recharts](https://recharts.org/) v3.

| Item | Location |
|------|----------|
| Dependency | `recharts` in `package.json` |
| Build optimization | `experimental.optimizePackageImports` in `next.config.ts` |
| Shared chart theme | `src/lib/charts/config.ts` |
| Example bar chart | `src/components/dashboard/crack-type-chart.tsx` |
| Example donut chart | `src/components/dashboard/severity-chart.tsx` |
| Usage | `/dashboard` — charts render mock stats from `src/lib/mock-data.ts` |

Chart components are client components (`"use client"`) because Recharts relies on the DOM. Add new chart types under `src/components/dashboard/` and reuse tokens from `src/lib/charts/config.ts` for consistent tooltips and colors.

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Development server |
| `bun run build` | Production build |
| `bun run lint` | ESLint |
| `bun run test:e2e` | Playwright tests |
