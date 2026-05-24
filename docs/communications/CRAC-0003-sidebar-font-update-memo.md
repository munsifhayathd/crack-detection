# CRAC-0003: Sidebar font update — internal memo

**To:** Engineering, design, QA, and product stakeholders  
**From:** UX / Frontend team  
**Date:** 2026-05-23  
**Subject:** Upcoming sidebar typography update — rollout, training, and feedback  
**Status:** Published — ready for distribution

---

## Summary

The main dashboard sidebar is receiving a typography update as part of **CRAC-0001**. Navigation labels, branding text, and collapse controls inside the layout sidebar will render in **bold, italic, and uppercase** via the `.app-sidebar` CSS class.

Compatibility testing (**CRAC-0002**) has completed successfully across Chromium, Firefox, WebKit, and common mobile viewports. No layout regressions were observed.

This memo prepares the team for the transition, explains scope and implications, and provides channels for questions and training.

---

## What is changing

| Area | Before | After |
|------|--------|-------|
| Nav labels (Dashboard, Upload, Map View, etc.) | Standard weight, sentence case | **Bold, italic, uppercase** |
| “CrackDetect” branding | Standard styling | **Bold, italic, uppercase** (label reads as “CRACKDETECT”) |
| Collapse control label | Standard styling | **Bold, italic, uppercase** |
| Font family | Outfit (unchanged) | Outfit (unchanged) |
| Version badge (`v1.0`) | JetBrains Mono, uppercase | Unchanged — not affected by `.app-sidebar` |

### Implementation reference

- **Component:** `frontend/src/components/layout/sidebar.tsx` — uses `app-sidebar` class on the root `<aside>`.
- **CSS:** `frontend/src/app/globals.css` — `.app-sidebar { font-bold italic uppercase; }`.

---

## Scope — what is *not* changing

The following sidebars use separate styling and are **out of scope** for this update:

| Component | Location | Typography |
|-----------|----------|------------|
| Welcome sidebar | `frontend/src/components/welcome/welcome-sidebar.tsx` | Lowercase labels, no `.app-sidebar` |
| Upload data sidebar | `frontend/src/components/upload/data-sidebar.tsx` | Standard uppercase labels, no `.app-sidebar` |

Do not apply `.app-sidebar` to these components unless explicitly requested in a future ticket.

---

## Implications by role

### Developers

- New sidebar nav items added to `sidebar.tsx` automatically inherit `.app-sidebar` typography — no per-item CSS required.
- Avoid overriding `font-weight`, `font-style`, or `text-transform` on elements inside `.app-sidebar` unless there is a documented exception.
- Run `bun run test:e2e:sidebar-font` in `frontend/` after sidebar changes to confirm typography and layout stability.
- See [CRAC-0003 training session](CRAC-0003-sidebar-font-training.md) for a walkthrough of the CSS cascade and testing workflow.

### Designers

- Sidebar labels will appear in uppercase regardless of source copy (e.g., “Map View” renders as “MAP VIEW”).
- Account for slightly wider text when reviewing collapsed vs. expanded states; compatibility tests confirm no horizontal overflow at current widths (224px expanded / 64px collapsed).
- Welcome and upload sidebars retain their existing visual language — do not assume global sidebar typography applies app-wide.

### QA

- Regression checks are automated in `frontend/e2e/sidebar-font-compat.spec.ts`.
- Manual spot-check: expanded and collapsed sidebar on dashboard, upload, and map routes.
- Report issues via the [feedback mechanism](#feedback-and-questions) below.

### Product

- User-facing nav labels will appear in uppercase in the main sidebar only. No copy changes are required in route definitions; the transform is CSS-driven.

---

## Rollout timeline

| Milestone | Target date | Status |
|-----------|-------------|--------|
| CRAC-0001 implementation merged | 2026-05-22 | Complete |
| CRAC-0002 compatibility testing | 2026-05-23 | Complete — [test report](../testing/CRAC-0002-sidebar-font-compatibility.md) |
| CRAC-0003 internal communication (this memo) | 2026-05-23 | **Published** |
| Developer & designer training session | **2026-05-28, 14:00 UTC** | Scheduled — [session details](CRAC-0003-sidebar-font-training.md) |
| Feedback window open | 2026-05-23 → 2026-06-06 | Active |
| Rollout to all environments | 2026-06-02 | Planned |

---

## Distribution

This memo must reach all stakeholders before the production rollout on 2026-06-02.

### Distribution list

| Group | Contacts / channel |
|-------|-------------------|
| Frontend engineering | `#crack-detection-frontend` (Slack) |
| Design | `#crack-detection-design` (Slack) |
| QA | `#crack-detection-qa` (Slack) |
| Product | `#crack-detection-product` (Slack) |
| All engineering | `#crack-detection` (Slack) — pin this memo for one week |

### Distribution checklist

- [x] Memo published in repository (`docs/communications/`)
- [ ] Posted to `#crack-detection` with link to this document (owner: UX lead)
- [ ] Training calendar invite sent to developers and designers (owner: UX lead)
- [ ] Feedback issue template verified and linked (owner: Engineering lead)

> **Action for team leads:** After this PR merges, post the memo URL in the channels above and confirm checklist items within two business days.

---

## Feedback and questions

A dedicated feedback channel is available for the duration of the rollout (through **2026-06-06**).

### How to submit feedback

1. Open a **Sidebar font feedback** issue in this repository using the [issue template](../../.github/ISSUE_TEMPLATE/sidebar-font-feedback.yml).
2. Apply the `sidebar-font` label (added automatically by the template).
3. Include the page/route, browser, and a screenshot when reporting a visual defect.

### Response expectations

| Priority | Examples | Target response |
|----------|----------|-----------------|
| **P1 — Blocker** | Layout break, unreadable text, nav item clipped | 1 business day |
| **P2 — Important** | Inconsistent typography, accessibility concern | 3 business days |
| **P3 — Question** | Scope clarification, design intent | 5 business days |

Questions and feedback are triaged in the weekly frontend sync. For urgent blockers, also ping `#crack-detection-frontend`.

---

## Training

A live training session is scheduled for **developers and designers**:

- **Date:** Wednesday, 2026-05-28
- **Time:** 14:00–15:00 UTC
- **Format:** 45-minute walkthrough + 15-minute Q&A
- **Details:** [CRAC-0003 sidebar font training session](CRAC-0003-sidebar-font-training.md)

Attendance is recommended for anyone modifying sidebar components, nav copy, or related layout CSS.

---

## Related tickets

| Ticket | Description |
|--------|-------------|
| **CRAC-0001** | Sidebar font style implementation (italic, bold, uppercase) |
| **CRAC-0002** | Sidebar font compatibility testing |
| **CRAC-0003** | Internal communication, feedback, and training (this memo) |

---

## FAQ

**Will this affect the welcome page sidebar?**  
No. The welcome sidebar uses its own styling and intentionally keeps lowercase labels.

**Do I need to update nav label strings to uppercase?**  
No. CSS `text-transform: uppercase` handles display. Keep source labels in readable sentence case (e.g., `"Map View"`).

**What if a new sidebar is added?**  
Only apply `app-sidebar` to the main layout sidebar unless design specifies otherwise. Discuss in the training session or open a feedback issue.

**Where are the automated tests?**  
`frontend/e2e/sidebar-font-compat.spec.ts` — run via `bun run test:e2e:sidebar-font`.
