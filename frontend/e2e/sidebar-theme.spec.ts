import { expect, test, type Page } from "@playwright/test";

async function getSidebarBackgroundColor(page: Page) {
  return page.locator("aside.app-sidebar").evaluate((element) => {
    return window.getComputedStyle(element).backgroundColor;
  });
}

async function getHtmlThemeClass(page: Page) {
  return page.evaluate(() => document.documentElement.classList.contains("dark"));
}

test.describe("Sidebar dark and light mode (CRAC-0019)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector("aside.app-sidebar");
  });

  test("shows a theme toggle in the sidebar footer", async ({ page }) => {
    const themeToggle = page.getByRole("button", {
      name: /switch to (light|dark) mode/i,
    });
    await expect(themeToggle).toBeVisible();
  });

  test("toggles between light and dark themes from the sidebar", async ({
    page,
  }) => {
    const themeToggle = page.getByRole("button", {
      name: /switch to (light|dark) mode/i,
    });
    const initialIsDark = await getHtmlThemeClass(page);
    const initialBackground = await getSidebarBackgroundColor(page);

    await themeToggle.click();

    await expect
      .poll(async () => getHtmlThemeClass(page))
      .toBe(!initialIsDark);

    const toggledBackground = await getSidebarBackgroundColor(page);
    expect(toggledBackground).not.toBe(initialBackground);

    await themeToggle.click();

    await expect
      .poll(async () => getHtmlThemeClass(page))
      .toBe(initialIsDark);
  });

  test("keeps theme toggle accessible when sidebar is collapsed", async ({
    page,
  }) => {
    await page.getByRole("button", { name: /collapse/i }).click();
    await expect(page.locator("aside.app-sidebar")).toHaveClass(/\bw-16\b/);

    const themeToggle = page.getByRole("button", {
      name: /switch to (light|dark) mode/i,
    });
    await expect(themeToggle).toBeVisible();
  });
});
