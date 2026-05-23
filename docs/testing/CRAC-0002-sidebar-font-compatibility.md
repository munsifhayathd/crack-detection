# CRAC-0002: Sidebar font compatibility testing

Compatibility testing for the sidebar typography introduced in CRAC-0001 (`.app-sidebar`: italic, bold, uppercase). Validates rendering and layout stability across major browser engines and common device viewports.

## Scope

| Area | Coverage |
|------|----------|
| **Component** | Main layout sidebar (`frontend/src/components/layout/sidebar.tsx`) |
| **CSS** | `.app-sidebar` rules in `frontend/src/app/globals.css` |
| **Browsers** | Chromium (Chrome/Edge), Firefox, WebKit (Safari) via Playwright |
| **Viewports** | Desktop (1280×720 default) and mobile profiles (Pixel 7, iPhone 14) |
| **States** | Expanded sidebar, collapsed sidebar |

## Test suite

Automated checks live in `frontend/e2e/sidebar-font-compat.spec.ts`:

1. **Typography** — `font-style: italic`, `font-weight ≥ 700`, `text-transform: uppercase` on `.app-sidebar`
2. **Overflow** — No horizontal scroll overflow inside the sidebar (`scrollWidth ≤ clientWidth`)
3. **Layout alignment** — Main content `padding-left` matches sidebar width (224px expanded, 64px collapsed)
4. **Collapse transition** — Typography preserved after collapse; widths remain stable
5. **Branding visibility** — “CrackDetect” label visible with inherited uppercase transform

### Run locally

```bash
cd frontend
bun install
bunx playwright install --with-deps chromium firefox webkit
bun run test:e2e:sidebar-font
```

Full cross-browser matrix:

```bash
bun run test:e2e
```

## Results (2026-05-23)

Executed via Playwright 1.52 against a production build (`next build` + `next start`).

| Browser / device | Typography | No overflow | Layout alignment | Collapse state | Branding | Status |
|------------------|------------|-------------|------------------|----------------|----------|--------|
| Chromium (Desktop Chrome) | Pass | Pass | Pass | Pass | Pass | **Pass** |
| Firefox (Desktop Firefox) | Pass | Pass | Pass | Pass | Pass | **Pass** |
| WebKit (Desktop Safari) | Pass | Pass | Pass | Pass | Pass | **Pass** |
| Mobile Chrome (Pixel 7) | Pass | Pass | Pass | Pass | Pass | **Pass** |
| Mobile Safari (iPhone 14) | Pass | Pass | Pass | Pass | Pass | **Pass** |

**Summary:** All 25 test cases (5 checks × 5 browser profiles) passed. No layout shifts or rendering regressions were observed. Italic + bold + uppercase styles render consistently; sidebar width and main-content offset stay in sync in both expanded and collapsed modes.

## Known limitations

- Tests use Playwright’s bundled browser engines, not physical devices or legacy IE.
- Welcome sidebar (`welcome-sidebar.tsx`) and upload data sidebar (`data-sidebar.tsx`) use separate typography and are out of scope for CRAC-0001 styling.
- Mapbox and authenticated flows are not exercised in this suite.

## Related tickets

- **CRAC-0001** — Sidebar font style implementation (italic, bold, uppercase)
- **CRAC-0002** — This compatibility testing pass
- **CRAC-0003** — [Internal communication, feedback, and training](../communications/CRAC-0003-sidebar-font-update-memo.md)
