# CRAC-0046: Vercel deployment build error — Sparkles in sidebar diagnosis

Technical diagnosis of the Vercel preview/production build failure tied to the `Sparkles` icon import in `frontend/src/components/layout/sidebar.tsx`.

## Summary

| Item | Finding |
|------|---------|
| **Root cause** | Duplicate named import: `Sparkles` appears twice in the same `lucide-react` import block |
| **Build error** | `the name 'Sparkles' is defined multiple times` (Turbopack / Next.js 16) |
| **Introduced by** | Merge commit `bb52719` — *Merge branch 'main' into cursor/implement-welcome-page-routing-fea1* (2026-05-22) |
| **Fixed on `main`** | Commit `b502306` / auto-merge `f90b88c` (CRAC-0002, 2026-05-23) |
| **Affected deployment** | Vercel preview for PR #22 (`cursor/integrate-welcome-sidebar-a253`) — deployment `dpl_GUjtMm8CYLxftfNiw3TWwSbae1vU` |
| **Current `main` status** | **Build passes** — single `Sparkles` import confirmed |

The failure is **not** caused by a missing `Sparkles` export from `lucide-react@0.577.0`, a Vercel-specific bundler limitation, or an invalid icon name. It is a plain duplicate identifier in the ES module import list.

---

## Error observed on Vercel

When the duplicate import is present, `next build` (Turbopack) fails during compilation:

```text
> Build error occurred
Error: Turbopack build failed with 1 errors:
./src/components/layout/sidebar.tsx:15:3
Ecmascript file had an error
  13 |   PanelLeftClose,
  14 |   PanelLeft,
> 15 |   Sparkles,
     |   ^^^^^^^^
  16 | } from "lucide-react";

the name `Sparkles` is defined multiple times
```

Import traces point through `main-layout.tsx` → `(dashboard)/layout.tsx`, so the failure blocks the entire dashboard shell.

---

## Faulty code (reproduced)

```tsx
import {
  LayoutDashboard,
  Upload,
  Map,
  Database,
  Briefcase,
  Scan,
  Sparkles,      // first occurrence
  PanelLeftClose,
  PanelLeft,
  Sparkles,      // duplicate — causes build failure
} from "lucide-react";
```

Correct form (current `main`):

```tsx
import {
  LayoutDashboard,
  Upload,
  Map,
  Database,
  Briefcase,
  Scan,
  Sparkles,
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";
```

---

## Timeline

| Date | Event |
|------|-------|
| 2026-05-22 | CRAC-0036 adds Welcome nav item with a single `Sparkles` import (`3da698c`) |
| 2026-05-22 | CRAC-0038 routing work merges `main`; merge commit `bb52719` leaves **two** `Sparkles` entries in the import block |
| 2026-05-22 03:38 UTC | Vercel preview deployment fails for PR #22 ([deployment logs](https://vercel.com/munsif-hayats-projects/crack-detection/GUjtMm8CYLxftfNiw3TWwSbae1vU)) |
| 2026-05-23 | CRAC-0002 removes duplicate import while adding sidebar font e2e tests (`b502306`) |
| 2026-05-24 | CRAC-0046 diagnosis confirms root cause; `main` builds successfully |

---

## Reproduction steps

From a clean frontend install:

```bash
cd frontend
npm ci
npm run build   # passes on current main
```

To reproduce the historical failure locally, temporarily restore the duplicate import in `sidebar.tsx` (lines 12 and 15) and run `npm run build` again. The Turbopack error above appears immediately.

Verified in this diagnosis on 2026-05-24:

- **Environment:** Next.js 16.1.6, Node/npm, `lucide-react@0.577.0`
- **Clean install:** `npm ci` (mirrors typical Vercel npm workflow)
- **Result:** Duplicate import fails; single import succeeds

---

## Branches still at risk

Rebase or merge `main` before redeploying if these branches are revived:

| Branch | `Sparkles` imports in `sidebar.tsx` | Status |
|--------|-------------------------------------|--------|
| `main` | 1 | OK |
| `cursor/integrate-welcome-sidebar-a253` (PR #22) | 2 | **Still broken** |
| `cursor/create-welcome-sidebar-db97` | 1 | OK |

---

## Recommended follow-up (out of scope for CRAC-0046)

1. **Fix PR #22** — Rebase onto current `main` or remove the duplicate import before merge.
2. **Merge conflict hygiene** — When adding lucide icons during parallel welcome-page work, diff import blocks after every merge; duplicate named imports are not caught by ESLint by default.
3. **Optional CI guard** — Add a lint rule or simple script to detect duplicate identifiers in import declarations.

---

## Related tickets

- **CRAC-0036** — Welcome sidebar component (introduced `Sparkles` nav icon)
- **CRAC-0038** — Welcome page routing (merge introduced duplicate)
- **CRAC-0002** — Sidebar font compatibility testing (incidentally fixed duplicate import)
- **CRAC-0046** — This diagnosis

## References

- Component: `frontend/src/components/layout/sidebar.tsx`
- Failed Vercel deployment: `dpl_GUjtMm8CYLxftfNiw3TWwSbae1vU` (PR #22)
- Team memo: [CRAC-0046 internal memo](../communications/CRAC-0046-vercel-sparkles-build-memo.md)
