import { expect, test } from "@playwright/test";

test.describe("Event grouping", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/events");
  });

  test("should display events grouped by year and upcoming status", async ({ page }) => {
    // Check that group titles are visible
    const groupTitles = page.getByTestId("section-title");
    await expect(groupTitles.first()).toBeVisible();

    // Verify we have at least one group
    const groupCount = await groupTitles.count();
    expect(groupCount).toBeGreaterThan(0);

    // Check that events are displayed within groups
    const eventCards = page.getByTestId("event-card");
    await expect(eventCards.first()).toBeVisible();
  });

  test("should hide empty groups when filtering", async ({ page }) => {
    // Apply a filter that results in few events
    const searchInput = page.getByTestId("events-search-input");
    await searchInput.fill("very specific search that matches few events");

    // Wait for filtering to complete
    await page.waitForTimeout(500);

    // Get all visible sections
    const visibleSections = page
      .getByTestId("section")
      .filter({ has: page.getByTestId("section-title") });
    const sectionCount = await visibleSections.count();

    // Each visible section should have at least one event
    for (let i = 0; i < sectionCount; i++) {
      const section = visibleSections.nth(i);
      const eventsInSection = section.getByTestId("event-card");
      const eventCount = await eventsInSection.count();

      // Each visible group should have at least one event
      expect(eventCount).toBeGreaterThan(0);
    }
  });

  test("should work with different view modes", async ({ page }) => {
    // Test grid view (default)
    const gridView = page.getByTestId("events-grid-view");
    const gridGroups = gridView.getByTestId("section-title");
    await expect(gridGroups.first()).toBeVisible();

    // Switch to compact view
    const compactViewButton = page.getByTestId("view-mode-compact");
    await compactViewButton.click();

    // Wait for navigation
    await page.waitForURL("**/events/list**");

    // Check compact view groups
    const compactView = page.getByTestId("events-compact-view");
    const compactGroups = compactView.getByTestId("section-title");
    await expect(compactGroups.first()).toBeVisible();
  });

  test("should sort groups correctly", async ({ page }) => {
    // Get initial group titles in default sort order (newest first)
    const groupTitles = await page.getByTestId("section-title").allTextContents();

    // Click sort button to change to oldest first
    const sortButton = page.getByRole("button", { name: /sort/i });
    await sortButton.click();

    // Wait for re-render
    await page.waitForTimeout(500);

    // Get group titles after sorting
    const sortedGroupTitles = await page.getByTestId("section-title").allTextContents();

    // Verify the order changed
    expect(sortedGroupTitles).not.toEqual(groupTitles);

    // If "Upcoming" exists, it should be last when oldest first
    if (sortedGroupTitles.includes("Upcoming")) {
      expect(sortedGroupTitles[sortedGroupTitles.length - 1]).toBe("Upcoming");
    }
  });
});
