import { expect, test, type Page } from "@playwright/test";

async function getSidebarStyles(page: Page) {
  const sidebar = page.locator("aside.app-sidebar");
  await expect(sidebar).toBeVisible();

  return sidebar.evaluate((element) => {
    const computed = window.getComputedStyle(element);
    return {
      fontStyle: computed.fontStyle,
      fontWeight: computed.fontWeight,
      textTransform: computed.textTransform,
      width: element.getBoundingClientRect().width,
    };
  });
}

async function getMainContentOffset(page: Page) {
  return page.locator("main").evaluate((element) => {
    const parent = element.parentElement;
    if (!parent) {
      throw new Error("Main content wrapper not found");
    }
    return parseFloat(window.getComputedStyle(parent).paddingLeft);
  });
}

function mainSidebar(page: Page) {
  return page.locator("aside.app-sidebar");
}

function welcomePanel(page: Page) {
  return page.getByRole("complementary", { name: "welcome" });
}

function welcomeNavLink(page: Page) {
  return mainSidebar(page).getByRole("link", { name: "Welcome" });
}

test.describe("Sidebar integration (CRAC-0049)", () => {
  test.describe("Welcome message and navigation", () => {
    test("navigates from main sidebar to welcome page", async ({ page }) => {
      await page.goto("/dashboard");
      await page.waitForSelector("aside.app-sidebar");

      await welcomeNavLink(page).click();

      await expect(page).toHaveURL(/\/welcome$/);
      await expect(welcomePanel(page)).toBeVisible();
    });

    test("displays welcome message content correctly", async ({ page }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      const panel = welcomePanel(page);
      await expect(panel).toBeVisible();
      await expect(panel.getByRole("heading", { name: "welcome" })).toBeVisible();
      await expect(
        panel.getByRole("heading", { name: "welcome to crackdetect" })
      ).toBeVisible();
      await expect(
        panel.getByRole("heading", { name: "about this project" })
      ).toBeVisible();
      await expect(panel.getByText(/crackdetect helps you process road/i)).toBeVisible();
      await expect(panel.getByText(/upload csv files with image metadata/i)).toBeVisible();
    });

    test("marks Welcome nav item as active on welcome route", async ({ page }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      const link = welcomeNavLink(page);
      await expect(link).toHaveClass(/bg-sidebar-accent/);
      await expect(link.locator(".bg-sidebar-primary")).toBeVisible();
    });

    test("loads welcome page via direct deep link", async ({ page }) => {
      await page.goto("/welcome");

      await expect(welcomePanel(page)).toBeVisible();
      await expect(welcomeNavLink(page)).toHaveClass(/bg-sidebar-accent/);
    });
  });

  test.describe("Related component integration", () => {
    test("header shows welcome title and subtitle", async ({ page }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      await expect(
        page.getByRole("heading", { level: 1, name: "Welcome" })
      ).toBeVisible();
      await expect(
        page.getByText("// get started with crack detection")
      ).toBeVisible();
    });

    test("main sidebar and welcome panel render together", async ({ page }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      await expect(mainSidebar(page)).toBeVisible();
      await expect(welcomePanel(page)).toBeVisible();
    });

    test("main content stays aligned with sidebar width on welcome page", async ({
      page,
    }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      const sidebarWidth = (await getSidebarStyles(page)).width;
      const mainOffset = await getMainContentOffset(page);

      expect(mainOffset).toBeCloseTo(sidebarWidth, 0);
    });

    test("collapse toggle works on welcome page without hiding welcome panel", async ({
      page,
    }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      await page.getByRole("button", { name: /collapse/i }).click();
      await expect(mainSidebar(page)).toHaveClass(/\bw-16\b/);

      await expect
        .poll(async () => (await getSidebarStyles(page)).width, { timeout: 5_000 })
        .toBeCloseTo(64, 0);

      await expect(welcomePanel(page)).toBeVisible();

      const mainOffset = await getMainContentOffset(page);
      expect(mainOffset).toBeCloseTo(64, 0);
    });

    test("updates active nav state when navigating between welcome and dashboard", async ({
      page,
    }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      const dashboardLink = mainSidebar(page).getByRole("link", {
        name: "Dashboard",
      });

      await dashboardLink.click();
      await expect(page).toHaveURL(/\/dashboard$/);
      await expect(dashboardLink).toHaveClass(/bg-sidebar-accent/);
      await expect(welcomeNavLink(page)).not.toHaveClass(/bg-sidebar-accent/);

      await welcomeNavLink(page).click();
      await expect(page).toHaveURL(/\/welcome$/);
      await expect(welcomeNavLink(page)).toHaveClass(/bg-sidebar-accent/);
      await expect(dashboardLink).not.toHaveClass(/bg-sidebar-accent/);
    });
  });

  test.describe("Regression guards", () => {
    test("preserves main sidebar typography on welcome route", async ({ page }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      const styles = await getSidebarStyles(page);

      expect(styles.fontStyle).toBe("italic");
      expect(Number(styles.fontWeight)).toBeGreaterThanOrEqual(700);
      expect(styles.textTransform).toBe("uppercase");
    });

    test("keeps welcome panel typography separate from app-sidebar styling", async ({
      page,
    }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      const welcomeHeading = welcomePanel(page).getByRole("heading", {
        name: "welcome to crackdetect",
      });

      const textTransform = await welcomeHeading.evaluate(
        (element) => window.getComputedStyle(element).textTransform
      );
      expect(textTransform).not.toBe("uppercase");
    });

    test("main sidebar branding remains visible on welcome page", async ({
      page,
    }) => {
      await page.goto("/welcome");
      await page.waitForSelector("aside.app-sidebar");

      await expect(mainSidebar(page).getByText("CrackDetect")).toBeVisible();
    });
  });
});
