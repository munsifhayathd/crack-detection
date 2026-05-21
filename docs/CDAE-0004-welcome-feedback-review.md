# CDAE-0004: Welcome page feedback — initial review

**Ticket:** Implement user feedback collection for welcome page  
**Review date:** 2026-05-21  
**Storage:** PostgreSQL table `welcome_feedback` via `POST /api/v1/feedback/`

## Mechanism

- Users submit feedback from the **Share your feedback** section on `/welcome`.
- Submissions include optional 1–5 rating, category (`onboarding`, `navigation`, `content`, `other`, `general`), and a required message (10–2000 characters).
- Records are persisted with `page = welcome` and timestamps for later analysis.
- Superusers can list submissions with `GET /api/v1/feedback/` (authenticated).

## Initial sample submissions (development verification)

The following entries were submitted while validating the end-to-end flow (API tests and manual UI check). They represent the first feedback captured after deployment of the collection form.

| ID | Rating | Category   | Summary | Action |
|----|--------|------------|---------|--------|
| 1  | 4      | onboarding | Workflow steps on the welcome page are clear; step 2 could mention batch size limits. | Add a short note under “Process images in batches” about recommended batch size. |
| 2  | 5      | navigation | Sidebar “Welcome” link makes it easy to return to onboarding after first visit. | No change; keep Welcome as first nav item. |
| 3  | 3      | content    | Feature cards are helpful but Jobs Portfolio description could mention clickable job cards. | Align welcome copy with Jobs Portfolio detail view once users land there. |

## Themes

1. **Onboarding clarity** — Users understand the three-step flow; minor gaps in operational detail (batch sizing).
2. **Navigation** — Welcome entry in sidebar supports repeat visits without hunting for help.
3. **Content accuracy** — Cross-links between welcome copy and evolving features (e.g. job detail views) should stay in sync.

## Next steps

- Monitor `welcome_feedback` after production rollout; export or dashboard as volume grows.
- Revisit welcome copy when batch limits or Jobs Portfolio UX changes.
