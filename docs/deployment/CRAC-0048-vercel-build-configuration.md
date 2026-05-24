# CRAC-0048: Vercel build configuration

Updates the Next.js build configuration to reduce import-resolution conflicts during Vercel deployments.

## Problem

The frontend lives in a monorepo subdirectory and depends on packages with mixed module formats and subpath exports (`mapbox-gl`, `@base-ui/react`, `recharts`, etc.). Without explicit build settings, Vercel can encounter:

- Duplicate or conflicting module graphs from barrel imports
- Server-side bundling of browser-only packages (notably `mapbox-gl`)
- Incomplete dependency tracing when the app root is not the repository root

## Changes

| File | Change |
|------|--------|
| `frontend/next.config.ts` | Added monorepo tracing, externalized server packages, transpilation, and import optimization |
| `frontend/vercel.json` | Pinned Bun install/build commands for consistent Vercel builds |
| `frontend/src/app/globals.css` | Moved Mapbox CSS import here so `serverExternalPackages` applies cleanly to JS only |
| `frontend/src/components/map/mapbox-container.tsx` | Removed in-component Mapbox CSS import (now global) |

### `next.config.ts`

- **`outputFileTracingRoot`** — Points to the repository root so Vercel traces dependencies correctly from the monorepo layout.
- **`serverExternalPackages: ['mapbox-gl']`** — Keeps the Mapbox JS runtime out of the server bundle, avoiding SSR import failures.
- **`transpilePackages: ['@base-ui/react']`** — Transpiles subpath ESM exports used by shadcn/ui Base UI components.
- **`experimental.optimizePackageImports`** — Limits barrel-import fan-out for `@base-ui/react`, `date-fns`, `lucide-react`, and `recharts`.

### `vercel.json`

- Uses `bun install` and `bun run build` to match the project's package manager (`bun.lock`).

## Vercel project settings

When linking the project in Vercel, set **Root Directory** to `frontend`.

Required environment variables:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox GL access token |

## Verification

### Local production build

```bash
cd frontend
bun install   # or npm install
bun run build # or npm run build
```

Expected: `✓ Compiled successfully` with no Mapbox externalization warnings.

### Vercel build simulation (optional)

```bash
cd frontend
npx vercel build --yes
```

### Vercel deployment

1. Push the branch and open a PR (Vercel preview deploy runs automatically when the GitHub integration is enabled).
2. Confirm the preview deployment build completes successfully.
3. Smoke-test `/map` (Mapbox) and `/dashboard` (Recharts) on the preview URL.

## Results (2026-05-24)

Local verification with Next.js 16.1.6 (Turbopack):

| Check | Status |
|-------|--------|
| `npm run build` completes | **Pass** |
| No Mapbox `serverExternalPackages` CSS warning | **Pass** |
| All 12 app routes generated | **Pass** |
| `optimizePackageImports` experiment active | **Pass** |

_Vercel preview deployment should be confirmed on the PR after merge/preview build._
