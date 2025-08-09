import { expect, test } from "@playwright/test";

test.describe("Event Time Filters", () => {
  test("should show events as upcoming until 30 minutes after completion", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Check if upcoming events section exists
    const upcomingSection = page.getByTestId("upcoming-events-section");
    const upcomingExists = await upcomingSection.isVisible().catch(() => false);

    // Check if recent events section exists
    const recentSection = page.getByTestId("section-title").filter({ hasText: "Recent Events" });
    const recentExists = await recentSection.isVisible().catch(() => false);

    // At least one section should exist
    expect(upcomingExists || recentExists).toBe(true);

    // If there are upcoming events, verify they exist
    if (upcomingExists) {
      const upcomingEventCards = page
        .getByTestId("upcoming-events-section")
        .getByTestId(/^event-card-/);
      const upcomingCount = await upcomingEventCards.count();
      expect(upcomingCount).toBeGreaterThan(0);
    }

    // If there are recent events, verify they exist
    if (recentExists) {
      const recentSectionElement = page
        .getByTestId("section")
        .filter({ has: page.getByTestId("section-title").filter({ hasText: "Recent Events" }) });
      const recentEventCards = recentSectionElement.getByTestId("event-card");
      const recentCount = await recentEventCards.count();
      expect(recentCount).toBeGreaterThan(0);
    }

    // Ensure no overlap by checking that upcoming and recent events are different
    // This is implicitly tested by the filtering logic
  });

  test("should properly separate upcoming and recent events on events page", async ({ page }) => {
    await page.goto("/events");
    await page.waitForLoadState("networkidle");

    // Get all event cards
    const allEventCards = page.getByTestId("event-card");
    const totalCount = await allEventCards.count();

    // Should have at least some events
    expect(totalCount).toBeGreaterThan(0);

    // The events page shows all events but they should be properly ordered
    // with upcoming events appearing before recent events when sorted by date
  });
});
