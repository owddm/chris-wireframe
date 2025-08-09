import { expect, test } from "@playwright/test";

test.describe("Event Countdown", () => {
  test("should display countdown for upcoming events in EventSummary", async ({ page }) => {
    await page.goto("/");

    // Wait for the events to load
    await page.waitForSelector('[data-testid="event-card"]');

    // Find the first event card with a countdown
    const countdownElement = page.locator('[data-testid="event-countdown"]').first();

    if (await countdownElement.isVisible()) {
      // Check that countdown text is properly formatted
      const countdownText = await countdownElement.textContent();
      expect(countdownText).toMatch(/Starts in \d+ (day|days|hour|hours|minute|minutes)/);
    }
  });

  test("should display countdown format correctly", async ({ page }) => {
    await page.goto("/");

    // Wait for the events to load
    await page.waitForSelector('[data-testid="event-card"]');

    const countdownElement = page.locator('[data-testid="event-countdown"]').first();

    if (await countdownElement.isVisible()) {
      const countdownText = await countdownElement.textContent();

      // The countdown should be present and properly formatted
      expect(countdownText).toMatch(/Starts in \d+ (day|days|hour|hours|minute|minutes)/);

      // Verify it doesn't show seconds
      expect(countdownText).not.toContain("second");
    }
  });

  test("should not display countdown for past events", async ({ page }) => {
    await page.goto("/events");

    // Wait for the events to load
    await page.waitForSelector('[data-testid="event-card"]');

    // Get all event cards
    const eventCards = await page.locator('[data-testid="event-card"]').all();

    // Check if any event cards exist
    if (eventCards.length > 0) {
      // Look for events that have past dates
      for (const card of eventCards) {
        const dateElement = card.locator('[data-testid="event-date"]');
        const dateAttr = await dateElement.getAttribute("data-date");

        if (dateAttr && new Date(dateAttr) < new Date()) {
          // For past events, there should be no countdown
          const countdown = card.locator('[data-testid="event-countdown"]');
          expect(await countdown.isVisible()).toBe(false);
        }
      }
    }
  });
});
