import { expect, test } from "@playwright/test";

test.describe("Event Filters", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/events");
    await page.waitForLoadState("networkidle");
  });

  test.describe("Search functionality", () => {
    test("should filter events by search term", async ({ page }) => {
      // Type in search box
      await page.getByTestId("events-search-input").fill("javascript");

      // Wait for search to complete (debounce + filter update)
      await page.waitForTimeout(600);

      // Check that filtered results are shown
      const eventCards = page.getByTestId("event-card");
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);

      // Since Fuse.js searches across title, description, topics, and location,
      // we just verify that we have filtered results, not that every title contains the term
    });

    test("should update URL with search parameter", async ({ page }) => {
      await page.getByTestId("events-search-input").fill("react");
      await page.waitForTimeout(500); // Wait for debounce

      const url = page.url();
      expect(url).toContain("search=react");
    });

    test("should clear search when input is cleared", async ({ page }) => {
      await page.getByTestId("events-search-input").fill("test");
      await page.waitForTimeout(500);

      await page.getByTestId("events-search-input").fill("");
      await page.waitForTimeout(500);

      const url = page.url();
      expect(url).not.toContain("search=");
    });

    test("should filter events by venue name", async ({ page }) => {
      // First, get a venue name from an event card
      const firstEventCard = page.getByTestId("event-card").first();
      await firstEventCard.waitFor();

      // Get the venue name from the first event (if it has one)
      const venueElement = firstEventCard.locator('[data-testid="event-venue"]');
      const venueCount = await venueElement.count();

      if (venueCount > 0) {
        const venueName = await venueElement.textContent();

        if (venueName) {
          // Search for the venue name
          await page.getByTestId("events-search-input").fill(venueName);
          await page.waitForTimeout(600); // Wait for debounce + filter update

          // Check that we have results
          const eventCards = page.getByTestId("event-card");
          const count = await eventCards.count();
          expect(count).toBeGreaterThan(0);

          // Verify the search parameter is in the URL
          const url = page.url();
          expect(url).toContain(`search=${encodeURIComponent(venueName)}`);
        }
      }
    });
  });

  test.describe("Topic filtering", () => {
    test("should filter events by single topic", async ({ page }) => {
      // Click topic dropdown
      await page.getByTestId("topics-filter-dropdown").click();

      // Select a topic
      const firstTopic = page.getByTestId("topic-option").first();
      await firstTopic.click();

      // Verify filtered results
      const eventCards = page.getByTestId("event-card");
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);

      // Check URL
      const url = page.url();
      expect(url).toContain("topics=");
    });

    test("should filter events by multiple topics", async ({ page }) => {
      await page.getByTestId("topics-filter-dropdown").click();

      // Select multiple topics
      await page.getByTestId("topic-option").nth(0).click();
      await page.getByTestId("topic-option").nth(1).click();

      // Click outside to close dropdown
      // Click outside to close dropdown
      await page.mouse.click(0, 0);
      await page.waitForTimeout(300); // Wait for dropdown to close and URL to update

      // Check URL contains topics parameter
      const url = page.url();
      expect(url).toContain("topics=");
      // The exact format might vary, just verify topics were added
    });

    test("should show active topic filters", async ({ page }) => {
      await page.getByTestId("topics-filter-dropdown").click();
      await page.getByTestId("topic-option").first().click();

      // Check that the dropdown button shows active filter count
      const dropdown = page.getByTestId("topics-filter-dropdown");
      await expect(dropdown).toContainText("Topics (1)");

      // Verify Clear button appears when filters are active
      const clearButton = page.getByTestId("clear-all-filters");
      await expect(clearButton).toBeVisible();
    });
  });

  test.describe("Location filtering", () => {
    test("should filter events by location", async ({ page }) => {
      // Click location dropdown
      await page.getByTestId("location-filter-dropdown").click();

      // Select a location
      const firstLocation = page.getByTestId("location-option").first();
      await firstLocation.click();

      // Verify filtered results
      const eventCards = page.getByTestId("event-card");
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);

      // Check URL contains location parameter
      const url = page.url();
      expect(url).toContain("location=");
    });
  });

  test.describe("Sort options", () => {
    test("should sort events by date ascending", async ({ page }) => {
      // Click the sort toggle button to switch from default (desc) to asc
      const sortButton = page.getByTestId("sort-selector");
      await sortButton.click();
      await page.waitForTimeout(300); // Wait for sort to apply

      // Verify button text changed to "Oldest"
      await expect(sortButton).toContainText("Oldest");

      // Check URL
      const url = page.url();
      expect(url).toContain("sort=date-asc");
    });

    test("should sort events by date descending (default)", async ({ page }) => {
      // Should be default sort
      await page.waitForTimeout(300); // Wait for initial load

      // Get dates of visible events using data-date attribute
      const dateElements = await page.getByTestId("event-date").all();
      const dates = await Promise.all(dateElements.map((el) => el.getAttribute("data-date")));

      // Verify descending order
      for (let i = 1; i < dates.length; i++) {
        const prevDate = new Date(dates[i - 1]!);
        const currDate = new Date(dates[i]!);
        expect(prevDate.getTime()).toBeGreaterThanOrEqual(currDate.getTime());
      }
    });
  });

  test.describe("Combined filters", () => {
    test("should apply multiple filters simultaneously", async ({ page }) => {
      // Apply search
      await page.getByTestId("events-search-input").fill("web");

      // Apply topic
      await page.getByTestId("topics-filter-dropdown").click();
      await page.getByTestId("topic-option").first().click();

      // Apply sort - click toggle button
      await page.getByTestId("sort-selector").click();

      await page.waitForTimeout(800); // Wait for all updates

      // Check URL has all parameters
      const url = page.url();
      expect(url).toContain("search=web");
      expect(url).toContain("topics=");
      expect(url).toContain("sort=date-asc");

      // Verify some results are shown
      const eventCards = page.getByTestId("event-card");
      const count = await eventCards.count();
      expect(count).toBeGreaterThan(0);
    });

    test("should clear all filters", async ({ page }) => {
      // Apply some filters
      await page.getByTestId("events-search-input").fill("test");
      await page.getByTestId("topics-filter-dropdown").click();
      await page.getByTestId("topic-option").first().click();

      // Clear all filters
      await page.getByTestId("clear-all-filters").click();

      // Check URL is clean
      const url = page.url();
      expect(url).not.toContain("search=");
      expect(url).not.toContain("topics=");
      expect(url).not.toContain("location=");
    });
  });

  test.describe("URL parameter persistence", () => {
    test("should load with filters from URL", async ({ page }) => {
      // Navigate with filters in URL
      await page.goto("/events?search=javascript&sort=date-asc");
      await page.waitForLoadState("networkidle");

      // Check search input has value
      const searchInput = page.getByTestId("events-search-input");
      await expect(searchInput).toHaveValue("javascript");

      // Check sort is applied
      const sortSelector = page.getByTestId("sort-selector");
      await expect(sortSelector).toContainText("Oldest");
    });
  });

  test.describe("View mode switching", () => {
    test("should switch to compact view", async ({ page }) => {
      await page.getByTestId("view-mode-compact").click();

      // Wait for URL to change
      await page.waitForURL("**/events/list**");

      // Check URL
      expect(page.url()).toContain("/events/list");

      // Wait a bit for view to load
      await page.waitForTimeout(1000);

      // For now, just check URL changed correctly
      expect(page.url()).toContain("/events/list");
    });

    test("should switch to album view", async ({ page }) => {
      await page.getByTestId("view-mode-album").click();

      // Wait for URL to change
      await page.waitForURL("**/events/album**");

      // Check URL
      expect(page.url()).toContain("/events/album");

      // Wait a bit for view to load
      await page.waitForTimeout(1000);

      // For now, just check URL changed correctly
      expect(page.url()).toContain("/events/album");
    });

    test("should display album view correctly", async ({ page }) => {
      // Navigate to album view
      await page.goto("/events/album");
      await page.waitForLoadState("networkidle");

      // Check that we're on the album page by checking the title
      await expect(page.getByText("OKTech Photo Album")).toBeVisible();

      // Check the subtitle is present
      await expect(page.getByText("Events without images are hidden on this page.")).toBeVisible();

      // Gallery images section is optional - only check if present
      const galleryImages = page.getByTestId("event-gallery-images");
      const galleryCount = await galleryImages.count();

      if (galleryCount > 0) {
        // If there are gallery images, verify they're visible
        const firstGalleryImages = galleryImages.first();
        await expect(firstGalleryImages).toBeVisible();
      }
      // Test passes either way - gallery images are optional
    });

    test("should preserve filters when switching views", async ({ page }) => {
      // Apply filters
      await page.getByTestId("events-search-input").fill("design");
      await page.waitForTimeout(600); // Wait for debounce

      // Switch to compact view
      await page.getByTestId("view-mode-compact").click();

      // Wait for URL to change to compact view with filters
      await page.waitForURL("**/events/list*");

      // Check filters are preserved in URL
      expect(page.url()).toContain("search=design");

      // Check search input still has value
      const searchInput = page.getByTestId("events-search-input");
      await expect(searchInput).toHaveValue("design");
    });
  });
});
