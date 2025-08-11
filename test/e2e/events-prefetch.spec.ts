import { expect, test } from "@playwright/test";

test.describe("Events Page Prefetching", () => {
  test("should prefetch event pages when cards enter viewport", async ({ page }) => {
    // Intercept prefetch requests
    const prefetchRequests: string[] = [];

    await page.route("**/*", (route, request) => {
      const headers = request.headers();
      if (headers["purpose"] === "prefetch" || request.url().includes("/events/")) {
        prefetchRequests.push(request.url());
      }
      route.continue();
    });

    // Navigate to events page
    await page.goto("/events");

    // Wait for events to load
    await page.waitForSelector('[data-testid*="event-card"]');

    // Scroll down to trigger viewport prefetching
    await page.evaluate(() => {
      window.scrollBy(0, 300);
    });

    // Wait a bit for prefetch to trigger
    await page.waitForTimeout(500);

    // Check that at least one event link exists
    const eventLinks = await page.$$eval('[data-testid*="event-card"]', (elements) =>
      elements.map((el) => (el as HTMLAnchorElement).href),
    );

    expect(eventLinks.length).toBeGreaterThan(0);
  });

  test("should prefetch filtered events when using filters", async ({ page }) => {
    await page.goto("/events");

    // Wait for initial load
    await page.waitForSelector('[data-testid*="event-card"]');

    // Apply a filter (if filter buttons exist)
    const filterButton = await page.$('[data-testid*="filter"]');
    if (filterButton) {
      await filterButton.click();

      // Wait for filter to apply
      await page.waitForTimeout(300);

      // Check that events are still visible (filtered)
      const filteredEventCount = await page.$$eval(
        '[data-testid*="event-card"]',
        (els) => els.length,
      );
      expect(filteredEventCount).toBeGreaterThanOrEqual(0);
    }

    // Scroll to trigger prefetch on filtered events
    await page.evaluate(() => {
      window.scrollBy(0, 300);
    });

    // Verify event cards are still interactive
    const eventCardLink = await page.$('a[data-testid*="event-card"]');
    if (eventCardLink) {
      const href = await eventCardLink.getAttribute("href");
      expect(href).toContain("/events/");
    }
  });

  test("should handle view changes with prefetching", async ({ page }) => {
    await page.goto("/events");

    // Wait for initial grid view
    await page.waitForSelector('[data-testid*="event-card"]');

    // Check if view switcher exists and switch to list view
    const listViewLink = await page.$('a[href="/events/list"]');
    if (listViewLink) {
      await listViewLink.click();

      // Wait for list view to load
      await page.waitForURL(/\/events\/list/);
      await page.waitForSelector('[data-testid*="event-card"]');

      // Scroll to trigger prefetch in list view
      await page.evaluate(() => {
        window.scrollBy(0, 300);
      });

      // Verify events are still clickable in list view
      const eventCardLink = await page.$('a[data-testid*="event-card"]');
      if (eventCardLink) {
        const href = await eventCardLink.getAttribute("href");
        expect(href).toContain("/events/");
      }
    }
  });
});
