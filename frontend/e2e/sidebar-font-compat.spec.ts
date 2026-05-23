import { expect, test, type Page } from "@playwright/test";

async function getSidebarStyles(page: Page) {
  const sidebar = page.locator("aside.app-sidebar");
  await expect(sidebar).toBeVisible();

  return sidebar.evaluate((element) => {
    const computed = window.getComputedStyle(element);
    return {
      fontSize: computed.fontSize,
      fontStyle: computed.fontStyle,
      fontWeight: computed.fontWeight,
      textTransform: computed.textTransform,
      width: element.getBoundingClientRect().width,
      scrollWidth: element.scrollWidth,
      clientWidth: element.clientWidth,
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

test.describe("Sidebar font compatibility (CRAC-0002)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector("aside.app-sidebar");
  });

  test("applies small, italic, bold, and uppercase typography", async ({
    page,
  }) => {
    const styles = await getSidebarStyles(page);

    expect(parseFloat(styles.fontSize)).toBeCloseTo(14, 0);
    expect(styles.fontStyle).toBe("italic");
    expect(Number(styles.fontWeight)).toBeGreaterThanOrEqual(700);
    expect(styles.textTransform).toBe("uppercase");
  });

  test("renders nav labels without horizontal overflow", async ({ page }) => {
    const styles = await getSidebarStyles(page);

    expect(styles.scrollWidth).toBeLessThanOrEqual(styles.clientWidth + 1);
    expect(styles.width).toBeCloseTo(224, 0);

    const navLabels = page.locator("aside.app-sidebar nav a span");
    await expect(navLabels.first()).toBeVisible();

    for (const label of await navLabels.all()) {
      const box = await label.boundingBox();
      expect(box?.width).toBeGreaterThan(0);
    }
  });

  test("keeps main content aligned with sidebar width", async ({ page }) => {
    const sidebarWidth = (await getSidebarStyles(page)).width;
    const mainOffset = await getMainContentOffset(page);

    expect(mainOffset).toBeCloseTo(sidebarWidth, 0);
  });

  test("collapsed state preserves typography without layout breakage", async ({
    page,
  }) => {
    const sidebar = page.locator("aside.app-sidebar");
    await page.getByRole("button", { name: /collapse/i }).click();
    await expect(sidebar).toHaveClass(/\bw-16\b/);

    await expect
      .poll(async () => (await getSidebarStyles(page)).width, { timeout: 5_000 })
      .toBeCloseTo(64, 0);

    const styles = await getSidebarStyles(page);
    expect(styles.fontStyle).toBe("italic");
    expect(Number(styles.fontWeight)).toBeGreaterThanOrEqual(700);
    expect(styles.textTransform).toBe("uppercase");
    expect(styles.scrollWidth).toBeLessThanOrEqual(styles.clientWidth + 1);

    const mainOffset = await getMainContentOffset(page);
    expect(mainOffset).toBeCloseTo(64, 0);
  });

  test("branding text remains visible with uppercase styling", async ({
    page,
  }) => {
    const branding = page.locator("aside.app-sidebar").getByText("CrackDetect");
    await expect(branding).toBeVisible();

    const textTransform = await branding.evaluate(
      (element) => window.getComputedStyle(element).textTransform
    );
    expect(textTransform).toBe("uppercase");
  });
});
