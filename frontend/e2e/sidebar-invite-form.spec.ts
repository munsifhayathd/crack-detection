import { expect, test } from "@playwright/test";

test.describe("Sidebar invite form (CDAE-0022)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForSelector("aside.app-sidebar");
  });

  test("renders accessible email invite form in expanded sidebar", async ({
    page,
  }) => {
    const sidebar = page.locator("aside.app-sidebar");
    await expect(sidebar.getByRole("group", { name: /invite team member/i })).toBeVisible();

    const emailInput = sidebar.getByLabel(/^email$/i);
    await expect(emailInput).toHaveAttribute("type", "email");
    await expect(emailInput).toHaveAttribute("autocomplete", "email");

    await expect(
      sidebar.getByRole("button", { name: /send invite/i })
    ).toBeVisible();
  });

  test("shows validation error for invalid email", async ({ page }) => {
    const sidebar = page.locator("aside.app-sidebar");
    const emailInput = sidebar.getByLabel(/^email$/i);
    await emailInput.fill("not-an-email");
    await sidebar.getByRole("button", { name: /send invite/i }).click();

    const error = sidebar.getByRole("alert");
    await expect(error).toContainText(/valid email/i);
    await expect(emailInput).toHaveAttribute("aria-invalid", "true");
  });

  test("shows mock success message for valid email", async ({ page }) => {
    const emailInput = page.locator("aside.app-sidebar").getByLabel(/^email$/i);
    await emailInput.fill("Teammate@Example.COM");
    await page.getByRole("button", { name: /send invite/i }).click();

    const status = page.getByRole("status");
    await expect(status).toContainText("teammate@example.com");
    await expect(emailInput).toHaveValue("");
  });

  test("hides invite form when sidebar is collapsed", async ({ page }) => {
    await page.getByRole("button", { name: /collapse/i }).click();
    await expect(
      page.locator("aside.app-sidebar").getByRole("group", { name: /invite team member/i })
    ).toHaveCount(0);
  });
});
