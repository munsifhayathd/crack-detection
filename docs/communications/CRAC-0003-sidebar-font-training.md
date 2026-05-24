# CRAC-0003: Sidebar font update — training session

Live training for developers and designers on the sidebar typography rollout (CRAC-0001 / CRAC-0002 / CRAC-0003).

## Session details

| Field | Value |
|-------|-------|
| **Title** | Sidebar font update — developer & designer walkthrough |
| **Date** | Wednesday, 2026-05-28 |
| **Time** | 14:00–15:00 UTC |
| **Duration** | 60 minutes (45 min content + 15 min Q&A) |
| **Format** | Video call — link shared via team calendar invite |
| **Recording** | Will be posted to the team wiki after the session |
| **Facilitator** | Frontend / UX lead |
| **Required attendees** | Frontend developers, UI/UX designers |
| **Optional attendees** | QA, product, technical writing |

### Calendar invite

Team leads should send a calendar invite to the distribution list in the [internal memo](CRAC-0003-sidebar-font-update-memo.md#distribution) with:

- **Subject:** `[CRAC-0003] Sidebar font update — training (dev & design)`
- **Agenda:** Link to this document
- **Pre-read:** [CRAC-0003 internal memo](CRAC-0003-sidebar-font-update-memo.md) and [CRAC-0002 test report](../testing/CRAC-0002-sidebar-font-compatibility.md)

---

## Agenda

| Time | Topic | Owner |
|------|-------|-------|
| 0:00–0:05 | Welcome, goals, and rollout timeline | Facilitator |
| 0:05–0:15 | What changed: `.app-sidebar` CSS and component scope | Frontend |
| 0:15–0:25 | Out-of-scope sidebars (welcome, upload data) | Frontend |
| 0:25–0:35 | Design implications: uppercase transform, spacing, collapsed state | Design |
| 0:35–0:45 | Developer workflow: adding nav items, running e2e tests | Frontend |
| 0:45–1:00 | Q&A and feedback channel overview | All |

---

## Learning objectives

After this session, participants will be able to:

1. Identify which sidebar components use `.app-sidebar` typography.
2. Add new navigation items without breaking typography or layout conventions.
3. Run and interpret `sidebar-font-compat` Playwright tests locally.
4. Submit feedback via the GitHub issue template when questions or defects arise.
5. Explain to stakeholders why welcome/upload sidebars look different.

---

## Pre-read materials

| Document | Purpose |
|----------|---------|
| [CRAC-0003 internal memo](CRAC-0003-sidebar-font-update-memo.md) | Rollout context, FAQ, feedback process |
| [CRAC-0002 compatibility test report](../testing/CRAC-0002-sidebar-font-compatibility.md) | Browser/viewport test results |
| `frontend/src/components/layout/sidebar.tsx` | Main sidebar implementation |
| `frontend/src/app/globals.css` | `.app-sidebar` CSS rules |
| `frontend/e2e/sidebar-font-compat.spec.ts` | Automated regression suite |

---

## Hands-on exercise (optional, 10 min after session)

1. Check out `main` and start the frontend dev server (`cd frontend && bun dev`).
2. Open the dashboard and inspect `.app-sidebar` computed styles in DevTools.
3. Toggle sidebar collapse and confirm typography persists.
4. Run `bun run test:e2e:sidebar-font` and confirm all checks pass.

---

## Post-session actions

| Action | Owner | Due |
|--------|-------|-----|
| Post recording link to `#crack-detection` | Facilitator | 2026-05-29 |
| Update FAQ in memo if new questions emerged | UX lead | 2026-05-30 |
| Close or triage feedback issues from training | Engineering lead | 2026-06-02 |

---

## Related tickets

- **CRAC-0001** — Sidebar font style implementation
- **CRAC-0002** — Sidebar font compatibility testing
- **CRAC-0003** — Internal communication and training (this session)
