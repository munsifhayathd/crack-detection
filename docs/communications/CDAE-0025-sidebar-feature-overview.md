# CDAE-0025: Sidebar feature overview — internal stakeholder guide

**To:** Project managers, end-users, engineering, design, and QA  
**From:** Product / Frontend team  
**Date:** 2026-06-03  
**Subject:** Sidebar navigation, related panels, and contact email form  
**Status:** Published — ready for distribution

---

## Summary

CrackDetect uses **sidebar navigation** as the primary way to move between app areas. The prototype includes three sidebar-related UI patterns:

| Pattern | Where it appears | Purpose |
|---------|------------------|---------|
| **Main layout sidebar** | Fixed left edge on every dashboard page | Global navigation, branding, collapse control |
| **Welcome panel** | Main content on `/welcome` | Onboarding copy and product introduction |
| **Upload data sidebar** | Left column on `/upload` after CSV load | Survey file metadata, GPS coverage, column list |

This guide explains what each part does, how to use navigation and the **email input form** on the Contact page (when deployed), and known prototype limitations so stakeholders can set expectations and give useful feedback.

---

## Purpose of the sidebar

The main layout sidebar keeps core workflows one click away:

1. **Orientation** — Branding (“CrackDetect”) and version badge confirm which app build you are using.
2. **Navigation** — Links to Welcome, Dashboard, Upload, Data, Map View, and Jobs Portfolio (and Contact when enabled).
3. **Context** — The active route is highlighted so users always know where they are.
4. **Screen space** — Collapse toggles between a full labeled sidebar and a compact icon-only strip.

The welcome panel and upload data sidebar are **contextual**: they add information for specific pages without replacing the main navigation sidebar.

---

## Main layout sidebar — how to use

### Navigation items

| Label | Route | What you can do there |
|-------|-------|------------------------|
| Welcome | `/welcome` | Read onboarding copy and return to getting-started content |
| Dashboard | `/dashboard` | View summary stats, charts, and recent jobs |
| Upload | `/upload` | Upload CSV survey data and run batch detection |
| Data | `/data` | Browse loaded survey records in a table |
| Map View | `/map` | Explore detections on an interactive map |
| Jobs Portfolio | `/jobs-portfolio` | Review detection jobs and open job details |
| Contact *(when enabled)* | `/contact` | Send a message via the email input form (see below) |

Nav labels in the main sidebar display in **bold, italic, uppercase** styling. Source copy remains sentence case in code; the visual transform is CSS-driven (see [CRAC-0003 memo](CRAC-0003-sidebar-font-update-memo.md)).

### Active route indicator

- The link for your current page uses a highlighted background and primary accent color.
- A small dot appears beside the active label when the sidebar is expanded.
- Parent routes stay active for nested paths (for example, a job detail URL under Jobs Portfolio).

### Collapse and expand

1. Scroll to the bottom of the main sidebar.
2. Click **Collapse** to switch to icon-only mode (64px wide).
3. Click the panel icon to expand again (224px wide).
4. Main content shifts automatically; no page reload is required.

**Prototype note:** Collapse state resets when you refresh the browser. It is not saved per user.

### Header sync

The top header shows a page title and subtitle for most routes (for example, Welcome shows “// get started with crack detection”). The header bell icon is decorative in the prototype — it does not open notifications.

---

## Welcome panel

Reach the welcome panel from the main sidebar: click **Welcome**, or open `/welcome` directly.

**Content includes:**

- Product introduction (“welcome to crackdetect”)
- Workflow summary: upload CSV → batch detection → dashboard and map review

The welcome panel uses **lowercase** typography and is intentionally separate from main sidebar styling. It appears in the main content area, not in the fixed left navigation column.

---

## Upload data sidebar

The upload data sidebar appears on **Upload** only after a CSV file is parsed.

**It shows:**

- File name, row count, and column count
- Selection badge (`selected / total`)
- Collapsible sections: Overview stats, GPS Coverage, Columns, Image Files

Use section headers to expand or collapse detail blocks. Statistics are computed from the loaded CSV in the browser; nothing is persisted until you run processing.

---

## Email input form (Contact page)

When the **Contact** navigation item is enabled (prototype feature **CRAC-0020**), end-users and stakeholders can reach a contact form from anywhere in the app via the sidebar.

### How to open the form

1. Click **Contact** in the main layout sidebar (mail icon).
2. The app navigates to `/contact` and shows the **Contact us** card with the email input form.

### How to complete the form

| Field | Required | Instructions |
|-------|----------|----------------|
| **Name** | Yes | Enter your full name or team name. |
| **Email** | Yes | Enter a valid email address (for example, `you@company.com`). The field uses standard email validation. |
| **Message** | Yes | Describe your question or issue in the text area (uploads, processing, results, or general product feedback). |

Steps:

1. Fill in all three fields.
2. Click **Send message**.
3. On success, the form is replaced by a **Message received** confirmation. You do not need to refresh the page.

### Email field tips

- Use a mailbox you check regularly if you expect a reply in a future production release.
- The email field accepts only well-formed addresses (must include `@` and a domain).
- Autofill from your browser (`autocomplete="email"`) is supported.

### Prototype limitations (Contact / email form)

| Limitation | Impact |
|------------|--------|
| **No server delivery** | Submissions are handled in the browser only. No email is sent to support and no ticket is created automatically. |
| **No persistence** | Messages are not stored in the database in the current prototype. |
| **Optional deployment** | The Contact nav item may not appear in all environments until CRAC-0020 is merged and deployed. |
| **Support mailbox** | The support email shown on the Contact page (`support@crackdetect.example`) is a placeholder, not a live inbox. |

For sidebar typography or layout feedback before Contact is live, use the [Sidebar font feedback](../../.github/ISSUE_TEMPLATE/sidebar-font-feedback.yml) GitHub issue template (see [CRAC-0003 memo](CRAC-0003-sidebar-font-update-memo.md)).

---

## Prototype limitations (sidebar overall)

| Area | Limitation |
|------|------------|
| Authentication | Login is a placeholder; sidebar is visible without signing in. |
| Collapse state | Not saved across sessions or devices. |
| Contact tab | May be absent on builds without CRAC-0020. |
| Notifications | Header bell has no action attached. |
| `/data` route | Listed in sidebar; header title may fall back to generic “Crack Detection”. |
| Upload sidebar | Only visible after CSV upload; hidden on empty upload state. |
| Typography scope | Bold/italic/uppercase applies to main sidebar only — not welcome or upload panels. |

---

## Verification (for QA and engineering)

Run automated sidebar checks from `frontend/`:

```bash
bun install
bun run test:e2e:sidebar-font      # Typography and layout (CRAC-0002)
bun run test:e2e:welcome-sidebar   # Welcome nav and panel integration (CRAC-0049)
```

Manual spot-check:

1. Open `/dashboard` — confirm all nav items render and Dashboard is active.
2. Navigate to Welcome, Upload (with sample CSV), and Map View — confirm active state updates.
3. Collapse and expand the sidebar — confirm content offset adjusts.
4. If Contact is enabled — submit the email form with a test address and confirm the success message.

---

## Distribution

| Group | Channel |
|-------|---------|
| Product & project management | `#crack-detection-product` (Slack) |
| End-user pilot group | Shared via pilot onboarding pack |
| Engineering & QA | `#crack-detection` (Slack) — link this document |

After this document merges to `main`, post the repository path in `#crack-detection` and pin for one week.

---

## Related documentation

| Ticket | Document |
|--------|----------|
| CRAC-0003 | [Sidebar font update — internal memo](CRAC-0003-sidebar-font-update-memo.md) |
| CRAC-0002 | [Sidebar font compatibility testing](../testing/CRAC-0002-sidebar-font-compatibility.md) |
| CRAC-0049 | [Sidebar integration testing](../testing/CRAC-0049-sidebar-integration-testing.md) |
| CRAC-0020 | Contact sidebar tab and Contact Us page (email form source) |

**Source components:**

- Main sidebar: `frontend/src/components/layout/sidebar.tsx`
- Layout shell: `frontend/src/components/layout/main-layout.tsx`
- Welcome panel: `frontend/src/components/welcome/welcome-sidebar.tsx`
- Upload data sidebar: `frontend/src/components/upload/data-sidebar.tsx`
- Contact form (when deployed): `frontend/src/components/contact/contact-content.tsx`

---

## FAQ

**Why does the sidebar look uppercase?**  
The main layout sidebar uses intentional bold, italic, uppercase styling (CRAC-0001). Welcome and upload sidebars keep their own typography.

**I collapsed the sidebar and the labels disappeared. Is that a bug?**  
No. Collapsed mode shows icons only. Expand using the button at the bottom of the sidebar.

**I don’t see Contact in my sidebar. Where is the email form?**  
Your environment may be on a build without CRAC-0020. Use the GitHub sidebar font feedback template for sidebar-specific questions, or ask your project manager which prototype build includes Contact.

**I submitted the Contact form but didn’t receive an email reply.**  
Expected in the prototype: the form shows a confirmation in the UI only. Messages are not emailed or stored until a production contact backend is implemented.

**What email address should I use in the form?**  
Use any valid address you control. In the prototype, the value is not transmitted off your device.

**Can I use the sidebar on mobile?**  
The layout is responsive; compatibility tests cover mobile viewports for typography and navigation. Very narrow screens may feel cramped when the sidebar is expanded.

**Does the upload data sidebar appear on every page?**  
No. It only appears on Upload after you load a CSV file.

**How do I report a sidebar layout bug?**  
Open a [Sidebar font feedback](../../.github/ISSUE_TEMPLATE/sidebar-font-feedback.yml) issue with the route, browser, and a screenshot. For Contact form behavior, note whether CRAC-0020 is deployed in your environment.

**Will collapse preference be saved in a future release?**  
Not in the current prototype. Persistence would require a separate enhancement (local storage or user preferences API).
