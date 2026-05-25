# Deployment documentation

Operational guides for deploying Crack Detection across environments.

## Documents

| Ticket | Document | Audience | Status | Date |
|--------|----------|----------|--------|------|
| [CRAC-0050](CRAC-0050-vercel-deployment.md) | [Vercel deployment process and lessons learned](CRAC-0050-vercel-deployment.md) | Engineering, DevOps, QA | **Published** — distribute via channels below | 2026-05-24 |

## How to share with the development team

1. Merge the documentation PR to `main`.
2. Post the link to [CRAC-0050](CRAC-0050-vercel-deployment.md) in the team Slack `#crack-detection` channel and pin it for two weeks.
3. Add the deployment doc to the team onboarding checklist (see **Distribution** in the CRAC-0050 document).
4. Reference this guide when configuring Vercel environment variables or investigating failed preview builds.

## Related documentation

- [CLAUDE.md](../../CLAUDE.md) — local development commands and architecture overview
- [CRAC-0002 sidebar font compatibility testing](../testing/CRAC-0002-sidebar-font-compatibility.md) — example of pre-merge build verification
- [AWS deployment workflow (draft PR #18)](https://github.com/munsifhayathd/crack-detection/pull/18) — planned backend deployment to AWS App Runner
