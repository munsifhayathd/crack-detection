# CRAC-0049: Sidebar integration testing

Integration testing for the updated sidebar and welcome message panel. Validates navigation, welcome content rendering, header sync, layout alignment, and regression guards for related layout components.

## Scope

| Area | Coverage |
|------|----------|
| **Main sidebar** | `frontend/src/components/layout/sidebar.tsx` |
| **Welcome panel** | `frontend/src/components/welcome/welcome-sidebar.tsx` |
| **Layout shell** | `frontend/src/components/layout/main-layout.tsx` |
| **Header** | `frontend/src/components/layout/header.tsx` |
| **Browsers** | Chromium, Firefox, WebKit, Pixel 7, iPhone 14 via Playwright |
| **States** | Expanded sidebar, collapsed sidebar, cross-route navigation |

## Test suite

Automated checks live in `frontend/e2e/welcome-sidebar-integration.spec.ts`:

### Welcome message and navigation

1. **Sidebar navigation** — Clicking “Welcome” in the main sidebar navigates to `/welcome`
2. **Welcome content** — Headings (“welcome”, “welcome to crackdetect”, “about this project”) and intro copy render correctly
3. **Active nav state** — Welcome link shows active styling on `/welcome`
4. **Deep link** — Direct navigation to `/welcome` loads the welcome panel with correct active state

### Related component integration

5. **Header sync** — Page title “Welcome” and subtitle “// get started with crack detection” display on the welcome route
6. **Dual sidebars** — Main layout sidebar and welcome panel are both visible on `/welcome`
7. **Layout alignment** — Main content offset matches sidebar width on the welcome page
8. **Collapse on welcome** — Collapse toggle works; welcome panel remains visible; content offset updates
9. **Cross-route nav** — Active nav state updates correctly when switching between welcome and dashboard

### Regression guards

10. **Main sidebar typography** — Italic, bold, uppercase styling preserved on `/welcome` (CRAC-0001/CRAC-0002)
11. **Typography isolation** — Welcome panel headings are not forced to uppercase by `.app-sidebar` rules
12. **Branding visibility** — “CrackDetect” branding remains visible in the main sidebar on `/welcome`

### Run locally

```bash
cd frontend
bun install
bunx playwright install --with-deps chromium firefox webkit
bun run test:e2e:welcome-sidebar
```

Run alongside existing sidebar font compatibility suite:

```bash
bun run test:e2e:sidebar-font
bun run test:e2e:welcome-sidebar
```

Full cross-browser matrix:

```bash
bun run test:e2e
```

## Related tickets

- **CRAC-0001** — Sidebar font style implementation
- **CRAC-0002** — Sidebar font compatibility testing
- **CRAC-0049** — This integration testing pass

## Known limitations

- Tests use Playwright’s bundled browser engines, not physical devices.
- Upload data sidebar (`data-sidebar.tsx`) and Mapbox flows are out of scope.
- Authenticated flows are not exercised in this suite.
