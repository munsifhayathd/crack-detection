# Signup Page Audit (CRAC-0006)

**Ticket:** CRAC-0006 — Check for existing signup page in codebase  
**Date:** 2026-05-21  
**Scope:** Frontend routes/components, backend auth and user APIs, related documentation

---

## Decision

**No signup page exists in the codebase today, and user self-registration is not supported end-to-end.**

| Question | Finding |
|----------|---------|
| Is a signup page present? | **No** — no `/signup` route, component, or navigation link |
| Is signup functional? | **No** — no public registration API and no frontend form wired to the backend |
| Should we implement a new signup page? | **Yes** — build on existing auth/user infrastructure rather than duplicating work |

Implementation should add a public registration path (backend endpoint + frontend page) as described in [Recommended next steps](#recommended-next-steps). Related setup guidance for signup and email lives on branch `cursor/signup-email-docs-dfd6` (CRAC-0005, not yet merged to `main`).

---

## Audit methodology

The following areas were reviewed on `main`:

- Frontend App Router pages under `frontend/src/app/`, including the `(auth)` route group
- Frontend API client and hooks (`frontend/src/lib/api/`)
- Backend auth router (`backend/src/auth/`) and users router/service (`backend/src/users/`)
- Repository-wide search for `signup`, `sign-up`, `register`, and `registration`
- Existing project documentation (`CLAUDE.md`, `frontend/README.md`)

---

## Frontend findings

### Auth routes

| Route | File | Status |
|-------|------|--------|
| `/login` | `frontend/src/app/(auth)/login/page.tsx` | Placeholder only — static heading and “Login page placeholder” text; no form, no API calls |
| `/signup` | — | **Does not exist** |

The `(auth)` route group contains only the login page. There is no shared auth layout, no signup page, and no links between login and signup.

### API integration

- `frontend/src/lib/api/client.ts` provides a generic HTTP client with retry logic but **no auth-specific helpers** (login, register, token storage).
- `frontend/src/lib/api/hooks.ts` exposes generic `useApi` / `useMutation` hooks; **nothing consumes auth endpoints**.
- No Zustand or other store manages auth state or JWT tokens.
- The home page (`frontend/src/app/page.tsx`) redirects to `/dashboard` with no auth gate.

### Search results

No matches for `signup`, `sign-up`, `register`, or `/signup` anywhere under `frontend/`.

---

## Backend findings

### Auth API (`/api/v1/auth`)

| Endpoint | Method | Purpose | Public? |
|----------|--------|---------|---------|
| `/auth/login` | POST | OAuth2 password flow; returns JWT access + refresh tokens | Yes |
| `/auth/refresh` | POST | Refresh access token | Yes |
| `/auth/register` (or similar) | — | **Does not exist** | — |

Login is implemented and functional for **pre-existing** users. There is no self-service registration endpoint.

### User API (`/api/v1/users`)

| Endpoint | Method | Auth required | Notes |
|----------|--------|---------------|-------|
| `POST /users/` | POST | **Superuser bearer token** | Creates users via `UserCreate` schema; not suitable for public signup |
| `GET /users/me` | GET | Authenticated user | Profile read |
| Other CRUD | Various | Superuser | Admin-only |

The `create_user` service (`backend/src/users/service.py`) handles password hashing and duplicate-email checks, but it is only reachable through the superuser-protected route. End users cannot register themselves through the current API surface.

### User model and schemas

Infrastructure that **can be reused** for signup:

- `User` model: `email`, `hashed_password`, `full_name`, `is_active`, `is_superuser`
- `UserCreate` schema: `email`, `password` (min 8 chars), optional `full_name`
- Password hashing via bcrypt in `backend/src/core/security.py`

### Email

No outbound email service is configured. `email-validator` is used only for Pydantic email format validation on user schemas. Email verification is out of scope for this audit but is documented on the CRAC-0005 branch.

### Tests

No backend tests cover user registration or signup flows (`backend/tests/` contains only health-check tests).

---

## Related documentation

| Document / branch | Status | Relevance |
|-------------------|--------|-----------|
| `docs/signup-and-email.md` | On branch `cursor/signup-email-docs-dfd6` (CRAC-0005), **not on `main`** | Implementation guide for signup page, public registration endpoint, and email integration |
| `CLAUDE.md` | On `main` | Notes `(auth)` route group is for login only; updated by this ticket to reference this audit |

---

## Recommended next steps

When implementing signup (follow-up tickets), reuse existing pieces:

1. **Backend:** Add a public `POST /api/v1/auth/register` (or `/auth/signup`) endpoint that calls `users.service.create_user` without superuser auth. Return tokens or redirect the client to login after success.
2. **Frontend:** Add `frontend/src/app/(auth)/signup/page.tsx` with a registration form (email, password, optional full name) calling the new endpoint via the API client.
3. **UX:** Link `/login` ↔ `/signup`; after registration, sign the user in or prompt them to log in.
4. **Email (optional):** Follow CRAC-0005 docs for verification email once the signup flow exists.

Do **not** duplicate the superuser-only `POST /users/` flow for end-user registration — expose a dedicated public endpoint with appropriate rate limiting and validation.

---

## Acceptance criteria (CRAC-0006)

- [x] Codebase reviewed for existing signup page
- [x] Documentation updated with findings (this file + `CLAUDE.md` reference)
- [x] Decision made on whether to implement new signup page (**Yes — implement new signup page**)
