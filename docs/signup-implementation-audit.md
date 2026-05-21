# Signup Implementation Status Audit (CRAC-0001)

**Ticket:** CRAC-0001 — Audit current signup implementation status  
**Date:** 2026-05-21  
**Branch audited:** `main`  
**Scope:** Backend auth/user APIs, frontend signup UI, test coverage, and supporting infrastructure

---

## Executive summary

**Signup is not implemented end-to-end.** The codebase has reusable backend building blocks (user model, password hashing, admin-only user creation, JWT login), but there is no public registration API, no signup page, no frontend auth integration, and no automated tests for registration flows.

| Area | Status | Ready for signup testing? |
|------|--------|---------------------------|
| Backend — public registration endpoint | **Not implemented** | No |
| Backend — user persistence layer | **Partial** (admin-only create path) | Partial |
| Backend — login / token issuance | **Implemented** | Yes (for pre-existing users only) |
| Frontend — signup page & form | **Not implemented** | No |
| Frontend — auth state & API wiring | **Not implemented** | No |
| Automated tests — signup / auth | **Not implemented** | No |
| Email verification | **Not implemented** | N/A |

**Impact on testing timelines:** Signup cannot be tested in any environment today. QA and integration testing for user registration must wait until at least a public backend registration endpoint and a frontend signup form are delivered. Existing login tests (manual or automated) only apply to users created by a superuser via `POST /api/v1/users/`.

---

## Audit methodology

Review performed on `main` as of 2026-05-21:

1. Backend auth router (`backend/src/auth/`), users router/service/schemas/models
2. Frontend App Router auth routes (`frontend/src/app/(auth)/`), API client, hooks, stores
3. Test suite under `backend/tests/`
4. Repository-wide search for `signup`, `sign-up`, `register`, and `registration`
5. Related in-flight documentation on open branches (`cursor/signup-email-docs-dfd6`, `cursor/check-signup-page-audit-e697`)

---

## Implementation status by layer

### Backend

| Component | Location | Status | Notes |
|-----------|----------|--------|-------|
| Public `POST /auth/register` (or equivalent) | — | **Missing** | No self-service registration endpoint |
| Login `POST /auth/login` | `backend/src/auth/router.py` | **Complete** | OAuth2 password form; returns JWT access + refresh tokens |
| Token refresh `POST /auth/refresh` | `backend/src/auth/router.py` | **Complete** | Validates refresh token type and active user |
| Admin user create `POST /users/` | `backend/src/users/router.py` | **Complete** | Requires superuser bearer token — not usable for public signup |
| `create_user` service | `backend/src/users/service.py` | **Complete** | Hashes password, checks duplicate email; callable only via superuser route today |
| `UserCreate` schema | `backend/src/users/schemas.py` | **Complete** | `email`, `password` (min 8 chars), optional `full_name` |
| `User` model | `backend/src/users/models.py` | **Complete** | `email`, `hashed_password`, `full_name`, `is_active`, `is_superuser` |
| Password hashing (bcrypt) | `backend/src/core/security.py` | **Complete** | `get_password_hash`, `verify_password` |
| JWT creation / validation | `backend/src/core/security.py` | **Complete** | Access + refresh tokens with type claim |
| Duplicate email handling | `backend/src/users/service.py` | **Complete** | Raises `ConflictError` (409) — ready for signup reuse |
| Rate limiting on registration | — | **Missing** | No throttling on auth routes |
| Email verification | — | **Missing** | No outbound email service configured |
| Alembic migrations | `backend/alembic/` | **Missing versions** | Only `env.py` / template present; no committed migration files on `main` |

#### Backend API surface (current)

| Endpoint | Method | Auth | Signup relevance |
|----------|--------|------|------------------|
| `/api/v1/auth/login` | POST | Public | Post-registration sign-in only |
| `/api/v1/auth/refresh` | POST | Public (refresh token) | Session renewal after signup |
| `/api/v1/auth/register` | — | — | **Does not exist** |
| `/api/v1/users/` | POST | Superuser | Creates users; blocks public signup |
| `/api/v1/users/me` | GET/PATCH | Authenticated | Profile after signup |

---

### Frontend

| Component | Location | Status | Notes |
|-----------|----------|--------|-------|
| Signup page `/signup` | — | **Missing** | No route, component, or navigation link |
| Login page `/login` | `frontend/src/app/(auth)/login/page.tsx` | **Placeholder** | Static heading only; no form or API calls |
| Auth layout | — | **Missing** | `(auth)` group has login page only; no shared layout |
| Auth API helpers | `frontend/src/lib/api/client.ts` | **Missing** | Generic HTTP client exists; no login/register/token helpers |
| Auth state (Zustand / context) | `frontend/src/store/` | **Missing** | Stores cover jobs, results, upload — not auth |
| Route protection | `frontend/src/app/(dashboard)/layout.tsx` | **Missing** | Dashboard accessible without authentication |
| Login ↔ signup navigation | — | **Missing** | No cross-links |
| Auth-related types | `frontend/src/types/index.ts` | **Missing** | No `User`, `TokenResponse`, or signup form types |

#### Frontend search results

No matches for `signup`, `sign-up`, `register`, or `/signup` under `frontend/`.

---

### Tests

| Test area | Location | Status | Notes |
|-----------|----------|--------|-------|
| Health check | `backend/tests/test_health.py` | **Present** | Only existing backend test |
| Auth / login tests | — | **Missing** | No coverage for `/auth/login` |
| User registration tests | — | **Missing** | No coverage for `create_user` or public signup |
| Duplicate email / validation tests | — | **Missing** | No schema or service-level tests |
| Test fixtures (DB, auth client) | `backend/tests/conftest.py` | **Minimal** | Only a settings fixture; no DB or auth helpers |
| Frontend signup tests | — | **Missing** | No component, E2E, or integration tests |

**Test infrastructure available:** `pytest`, `pytest-asyncio`, `httpx` (AsyncClient) are in `backend/requirements.txt` and used in `test_health.py`, so adding auth/signup tests is straightforward once endpoints exist.

---

## Building blocks available for signup (reuse, do not duplicate)

These pieces reduce implementation effort but do **not** constitute a signup feature on their own:

1. **`User` model and `UserCreate` schema** — field validation and persistence shape are defined.
2. **`create_user` service** — password hashing and duplicate-email checks are implemented; should be called from a new public auth endpoint, not exposed via the superuser-only users route.
3. **JWT login flow** — after registration, the client can authenticate via existing `/auth/login` or the new endpoint can return tokens directly.
4. **`ConflictError` (409)** — appropriate response for duplicate registration attempts.
5. **UI primitives** — shadcn/ui `Input`, `Button`, `Label`, `Alert` in `frontend/src/components/ui/` can compose a signup form quickly.

---

## Gaps identified

### Critical (blocks signup testing)

| # | Gap | Layer | Risk if unaddressed |
|---|-----|-------|---------------------|
| G1 | No public registration API endpoint | Backend | Users cannot self-register; all testing requires manual superuser provisioning |
| G2 | No signup page or registration form | Frontend | No user-facing signup path to test |
| G3 | No frontend auth integration (token storage, login form) | Frontend | Even after backend signup, users cannot complete sign-in from the app |
| G4 | No automated tests for registration or auth | Tests | Regressions undetected; signup QA relies entirely on manual effort |

### High (needed for production-quality signup)

| # | Gap | Layer | Notes |
|---|-----|-------|-------|
| G5 | No route protection on dashboard pages | Frontend | App is usable without auth today |
| G6 | No rate limiting on registration | Backend | Abuse / enumeration risk on public endpoint |
| G7 | No committed Alembic migrations | Backend/DB | User table migration path unclear on fresh deploys |
| G8 | No user bootstrap / seed script | Backend/Ops | First superuser must be created manually for admin user provisioning |

### Medium (follow-up, not blocking initial signup)

| # | Gap | Layer | Notes |
|---|-----|-------|-------|
| G9 | No email verification | Backend | Documented on branch `cursor/signup-email-docs-dfd6` (CRAC-0005) |
| G10 | No password reset flow | Backend/Frontend | Out of scope for initial signup |
| G11 | No frontend E2E test framework | Frontend | Consider Playwright/Cypress when signup UI lands |

---

## Testing timeline impact

| Testing activity | Can start now? | Blocker |
|------------------|----------------|---------|
| Manual signup happy path | **No** | G1, G2 |
| Duplicate email registration | **No** | G1 |
| Password validation (min length) | **Partial** | Schema exists; no public endpoint to exercise it |
| Post-signup login | **Partial** | Login API works; no UI and no self-registered users |
| Auth-gated dashboard access | **No** | G3, G5 |
| Automated signup regression suite | **No** | G1, G4 |
| Email verification testing | **No** | G9 |

**Recommendation:** Treat signup as **0% complete** for test-planning purposes. Schedule signup testing only after delivery of G1–G4 (minimum viable signup: public endpoint, signup page, basic auth wiring, backend tests).

---

## Related work on other branches

| Branch / ticket | Content | Merged to `main`? |
|-----------------|---------|-------------------|
| `cursor/check-signup-page-audit-e697` (CRAC-0006) | Signup page existence audit; recommends building new signup flow | No |
| `cursor/signup-email-docs-dfd6` (CRAC-0005) | Signup + email implementation guide (`docs/signup-and-email.md`) | No |

These branches align with this audit and can inform implementation tickets but do not change the current `main` implementation status.

---

## Recommended implementation sequence

To unblock testing with minimal scope:

1. **Backend:** Add `POST /api/v1/auth/register` calling `users.service.create_user`; return `UserResponse` or issue tokens via existing JWT helpers.
2. **Backend tests:** Add pytest coverage for successful registration, duplicate email (409), and password validation errors.
3. **Frontend:** Add `/signup` page with form (email, password, optional full name) using existing API client and UI components.
4. **Frontend:** Wire `/login` form to `/auth/login`; add basic token storage and optional dashboard auth gate.
5. **Follow-up:** Email verification (CRAC-0005), rate limiting, Alembic migrations, E2E tests.

Do **not** expose the superuser-only `POST /users/` route for end-user registration.

---

## Acceptance criteria (CRAC-0001)

- [x] Audit report generated detailing current signup implementation status (this document)
- [x] Gaps in current signup functionality identified (see [Gaps identified](#gaps-identified))
- [x] Findings documented and shared with the development team (via PR to `main`)
