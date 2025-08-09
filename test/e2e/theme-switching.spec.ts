import { expect, test } from "@playwright/test";

test.describe("Theme Switching", () => {
  test("should switch between light and dark themes", async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");

    // Wait for the page to load
    await page.waitForLoadState("networkidle");

    // Find and click the theme toggle button (works regardless of location)
    const themeToggle = page.getByTestId("theme-switcher").first();
    await expect(themeToggle).toBeVisible();

    // Verify initial state (light theme)
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // Click to switch to dark theme
    await themeToggle.click();

    // Wait for theme transition
    await page.waitForTimeout(300);

    // Verify dark theme is applied
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Click to switch back to light theme
    await themeToggle.click();

    // Wait for theme transition
    await page.waitForTimeout(300);

    // Verify light theme is applied again
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  });

  test("should persist theme selection across page reloads", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Switch to dark theme
    const themeToggle = page.getByTestId("theme-switcher").first();
    await themeToggle.click();

    // Wait for theme to be applied
    await page.waitForTimeout(300);
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Reload the page
    await page.reload();

    // Verify dark theme persists after reload
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  });

  test("should respect system preference on first visit", async ({ browser }) => {
    // Test with dark color scheme preference
    const darkContext = await browser.newContext({
      colorScheme: "dark",
    });
    const darkPage = await darkContext.newPage();

    await darkPage.goto("/");
    await expect(darkPage.locator("html")).toHaveAttribute("data-theme", "dark");

    await darkContext.close();

    // Test with light color scheme preference
    const lightContext = await browser.newContext({
      colorScheme: "light",
    });
    const lightPage = await lightContext.newPage();

    await lightPage.goto("/");
    await expect(lightPage.locator("html")).toHaveAttribute("data-theme", "light");

    await lightContext.close();
  });
});
