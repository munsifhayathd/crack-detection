# Compliance documentation

This directory holds data-protection and compliance artefacts for the Crack Detection prototype.

## Current reviews

| Ticket | Document | Status | Date |
|--------|----------|--------|------|
| [CRAC-0003](CRAC-0003-data-handling-compliance-review.md) | [Data handling compliance review](CRAC-0003-data-handling-compliance-review.md) | Complete — findings require team action | 2026-05-21 |

## Team action required (CRAC-0003)

The [CRAC-0003 review](CRAC-0003-data-handling-compliance-review.md) identified **8 high**, **12 medium**, and **7 low** severity items. Before wider prototype testing with real survey data:

1. **Remove or anonymise** committed survey geodata under `Context/` (see [H1](CRAC-0003-data-handling-compliance-review.md#h1--survey-geodata-in-version-control)).
2. **Rotate secrets** if the repository has been shared outside the core team (see [H2](CRAC-0003-data-handling-compliance-review.md#h2--weak-default-secrets)).
3. **Implement frontend authentication** before exposing the dashboard on any shared network (see [H4](CRAC-0003-data-handling-compliance-review.md#h4--unauthenticated-dashboard)).
4. **Publish governance docs** (privacy notice, retention, sub-processors) aligned with internal data protection policy (see [H6](CRAC-0003-data-handling-compliance-review.md#h6--missing-governance-documentation)).

Track remediation in your issue tracker using the issue IDs (`CRAC-0003-H1`, etc.) defined in the review report.

## How to use these documents

- **Developers:** Use the data-flow map and file references when implementing upload, auth, or logging changes.
- **Security / compliance:** Map findings to your internal data protection policy and jurisdictional requirements (this review is technical, not legal advice).
- **Product / delivery:** Prioritise high-severity items before user acceptance testing with non-synthetic data.
