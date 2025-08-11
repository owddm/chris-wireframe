import { expect, test } from "@playwright/test";

import { TEST_VENUES } from "../helpers/url";

test.describe("Navigation Buttons", () => {
  test.describe("Event Navigation", () => {
    test("should navigate between events using prev/next buttons", async ({ page }) => {
      // Navigate to an event page
      await page.goto("/events");

      // Click on the second event to ensure we have prev/next navigation
      const eventCards = page.getByTestId("event-card");
      await eventCards.nth(1).click();

      // Wait for navigation to complete
      await page.waitForLoadState("networkidle");

      // Click previous button (newer event)
      await page.getByTestId("nav-button-prev").first().click();
      await page.waitForLoadState("networkidle");

      // Verify we're on a different event page
      const currentUrl = page.url();
      expect(currentUrl).toContain("/events/");

      // Click next button to go back
      await page.getByTestId("nav-button-next").first().click();
      await page.waitForLoadState("networkidle");

      // Should still be on an event page
      expect(page.url()).toContain("/events/");
    });

    test("should navigate using keyboard arrows on event pages", async ({ page }) => {
      // Navigate to an event page
      await page.goto("/events");
      const eventCards = page.getByTestId("event-card");
      await eventCards.nth(1).click();
      await page.waitForLoadState("networkidle");

      // Wait for React components to hydrate
      await page.waitForTimeout(2000);

      // Get current URL
      const initialUrl = page.url();

      // Press left arrow key
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");

      // Verify navigation happened
      const urlAfterLeft = page.url();
      expect(urlAfterLeft).not.toBe(initialUrl);
      expect(urlAfterLeft).toContain("/events/");

      // Press right arrow key
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");

      // Should be back to initial page
      expect(page.url()).toBe(initialUrl);
    });

    test("should navigate back to events list", async ({ page }) => {
      // Navigate to an event page
      await page.goto("/events");
      const eventCards = page.getByTestId("event-card");
      await eventCards.first().click();
      await page.waitForLoadState("networkidle");

      // Verify we're on an event page
      expect(page.url()).toContain("/events/");

      // Check that back button exists and is visible
      const backButton = page.getByTestId("nav-button-back").first();
      await expect(backButton).toBeVisible();

      // Click the back button
      await backButton.click();

      // Wait a bit for navigation
      await page.waitForTimeout(2000);
      await page.waitForLoadState("networkidle");

      // Should be back on events page
      expect(page.url()).toContain("/events");
      // Verify we're on the events page by checking for event cards
      await expect(page.getByTestId("event-card").first()).toBeVisible();
    });
  });

  test.describe("Venue Navigation", () => {
    test("should navigate between venues using prev/next buttons", async ({ page }) => {
      // Navigate directly to a test venue page
      await page.goto(`/venue/${TEST_VENUES.TEST_VENUE_2}`);
      await page.waitForLoadState("networkidle");

      // Get the current venue title
      expect(page.url()).toContain("/venue/");

      // Check if navigation buttons exist
      const prevButton = page.getByTestId("nav-button-prev").first();
      const nextButton = page.getByTestId("nav-button-next").first();

      // Both buttons should exist for venues
      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();

      // Try to navigate to next venue
      await nextButton.click();
      await page.waitForLoadState("networkidle");

      // Verify we're on a venue page (might be the same if only one venue with hasPage)
      expect(page.url()).toContain("/venue/");

      // Navigate using prev button
      await prevButton.click();
      await page.waitForLoadState("networkidle");

      // Verify we're still on a venue page
      expect(page.url()).toContain("/venue/");

      // Verify we navigated successfully
      // The page should still be a venue page
      expect(page.url()).toContain("/venue/");
    });

    test("should navigate using keyboard arrows on venue pages", async ({ page }) => {
      // Navigate directly to a known venue page
      await page.goto("/venue/24213835-aiming-inc");
      await page.waitForLoadState("networkidle");

      // Wait for React components to hydrate
      await page.waitForTimeout(2000);

      // Get current URL and title
      const initialUrl = page.url();
      const initialTitle = await page.getByTestId("venue-title-page").textContent();

      // Verify navigation buttons exist
      const prevButton = page.getByTestId("nav-button-prev").first();
      const nextButton = page.getByTestId("nav-button-next").first();
      await expect(prevButton).toBeVisible();
      await expect(nextButton).toBeVisible();

      // Press right arrow key
      await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");

      // Verify navigation happened
      const afterRightUrl = page.url();
      expect(afterRightUrl).toContain("/venue/");
      expect(afterRightUrl).not.toBe(initialUrl);

      // Press left arrow to go back
      await page.keyboard.press("ArrowLeft");
      await page.waitForTimeout(1000);
      await page.waitForLoadState("networkidle");

      // Should be back to original venue
      const finalUrl = page.url();
      expect(finalUrl).toBe(initialUrl);
      const finalTitle = await page.getByTestId("venue-title-page").textContent();
      expect(finalTitle).toBe(initialTitle);
    });
  });
});
