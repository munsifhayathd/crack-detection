# Internal communications

This directory holds team-facing announcements, memos, and rollout guidance for Crack Detection.

## Active communications

| Ticket | Document | Audience | Status | Date |
|--------|----------|----------|--------|------|
| [CRAC-0046](CRAC-0046-vercel-sparkles-build-memo.md) | [Vercel Sparkles build failure — internal memo](CRAC-0046-vercel-sparkles-build-memo.md) | Frontend, DevOps, QA | **Published** — distribute via channels below | 2026-05-24 |
| [CRAC-0003](CRAC-0003-sidebar-font-update-memo.md) | [Sidebar font update — internal memo](CRAC-0003-sidebar-font-update-memo.md) | Engineering, design, QA, product | **Published** — distribute via channels below | 2026-05-23 |
| [CRAC-0003](CRAC-0003-sidebar-font-training.md) | [Sidebar font update — training session](CRAC-0003-sidebar-font-training.md) | Developers, designers | **Scheduled** — 2026-05-28 14:00 UTC | 2026-05-23 |

## How to distribute a memo

1. Merge the memo PR to `main`.
2. Post the memo link in the team Slack `#crack-detection` channel (pin for one week).
3. Send the memo summary to the distribution list defined in each document’s **Distribution** section.
4. Track questions via the feedback mechanism linked in the memo (GitHub issue template).

## Feedback

Use the [Sidebar font feedback](../../.github/ISSUE_TEMPLATE/sidebar-font-feedback.yml) issue template for questions about sidebar typography (CRAC-0003). Label: `sidebar-font`.

## Related documentation

- [CRAC-0046 Vercel Sparkles build diagnosis](../testing/CRAC-0046-vercel-sparkles-build-diagnosis.md)
- [CRAC-0002 sidebar font compatibility testing](../testing/CRAC-0002-sidebar-font-compatibility.md)
- Frontend sidebar component: `frontend/src/components/layout/sidebar.tsx`
- Sidebar typography CSS: `frontend/src/app/globals.css` (`.app-sidebar`)
