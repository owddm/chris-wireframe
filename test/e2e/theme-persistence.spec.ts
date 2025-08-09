import { expect, test } from "@playwright/test";

test.describe("Theme persistence", () => {
  test("dark theme should persist when navigating between pages", async ({ page }) => {
    // Start on the home page
    await page.goto("/");

    // Wait for page to load
    await page.waitForLoadState("networkidle");

    // Click the theme toggle to switch to dark mode
    const themeToggle = page.getByTestId("theme-switcher").first();
    await themeToggle.click();

    // Verify dark theme is applied
    const html = page.locator("html");
    await expect(html).toHaveAttribute("data-theme", "dark");

    // Navigate to another page (e.g., about page)
    await page.getByRole("link", { name: "About" }).first().click();

    // Wait for navigation
    await page.waitForURL("**/about");
    await page.waitForLoadState("networkidle");

    // Verify dark theme persists after navigation
    await expect(html).toHaveAttribute("data-theme", "dark");

    // Navigate to another page to double-check
    await page.getByRole("link", { name: "Events" }).first().click();

    // Wait for navigation
    await page.waitForURL("**/events");
    await page.waitForLoadState("networkidle");

    // Verify dark theme still persists
    await expect(html).toHaveAttribute("data-theme", "dark");
  });
});
