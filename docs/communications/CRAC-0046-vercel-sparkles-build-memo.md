# CRAC-0046: Vercel build failure — Sparkles sidebar import (internal memo)

**To:** Frontend developers, DevOps, QA  
**From:** Frontend / Platform  
**Date:** 2026-05-24  
**Subject:** Diagnosis of Vercel deployment failure related to `Sparkles` in sidebar  
**Status:** Published — diagnosis complete

---

## Summary

Vercel preview builds failed with a Turbopack compile error pointing at `Sparkles` in `frontend/src/components/layout/sidebar.tsx`. Investigation (**CRAC-0046**) confirms the root cause is a **duplicate `Sparkles` named import** in the same `lucide-react` import block—not a missing icon, package version mismatch, or Vercel platform issue.

**Current `main` is healthy:** the duplicate was removed in CRAC-0002 (2026-05-23). Production and preview builds from `main` should succeed.

---

## What failed

```text
the name `Sparkles` is defined multiple times
./src/components/layout/sidebar.tsx:15:3
```

This blocked the Next.js 16 production build for the dashboard layout because `sidebar.tsx` is imported by `MainLayout` on every authenticated page.

---

## How it happened

1. CRAC-0036 added the Welcome nav item and imported `Sparkles` once.
2. A merge of `main` into the welcome routing branch (`bb52719`, 2026-05-22) left **two** `Sparkles` entries in the import list—likely unresolved merge conflict residue.
3. Vercel preview for **PR #22** (`cursor/integrate-welcome-sidebar-a253`) failed at build time ([deployment `dpl_GUjtMm8CYLxftfNiw3TWwSbae1vU`](https://vercel.com/munsif-hayats-projects/crack-detection/GUjtMm8CYLxftfNiw3TWwSbae1vU)).
4. CRAC-0002 removed the duplicate while landing sidebar font e2e tests.

---

## Action items

| Audience | Action |
|----------|--------|
| **Owners of PR #22** | Rebase onto current `main` before merge; verify `npm run build` in `frontend/` |
| **All frontend devs** | After merging parallel sidebar work, review lucide import blocks for duplicate identifiers |
| **QA / release** | No change required for `main` deployments; re-test PR #22 only if that branch is revived |

---

## Verification

On `main` as of 2026-05-24:

```bash
cd frontend && npm ci && npm run build
```

Expected: build completes successfully; `/welcome` route is included in static output.

Full technical write-up: [CRAC-0046 diagnosis](../testing/CRAC-0046-vercel-sparkles-build-diagnosis.md).

---

## Distribution

1. Merge this memo PR to `main`.
2. Post link in `#crack-detection` Slack with label **CRAC-0046**.
3. Comment on PR #22 with rebase guidance if that PR remains open.

---

## Related documentation

- [CRAC-0046 technical diagnosis](../testing/CRAC-0046-vercel-sparkles-build-diagnosis.md)
- [CRAC-0002 sidebar font compatibility testing](../testing/CRAC-0002-sidebar-font-compatibility.md)
- Sidebar component: `frontend/src/components/layout/sidebar.tsx`
