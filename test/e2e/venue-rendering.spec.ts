import { expect, test } from "@playwright/test";

import { TEST_EVENTS, TEST_VENUES } from "../helpers/url";

test.describe("Venue Rendering on Event Pages", () => {
  // Set desktop viewport to ensure venue info is visible
  test.use({ viewport: { width: 1280, height: 720 } });

  test("Test Venue 1 is rendered on primary test event page", async ({ page }) => {
    await page.goto(`/events/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");

    // Check that venue title exists on the page
    // Use :visible pseudo-selector to get only visible elements
    const venueTitle = page.locator('[data-testid="venue-title"]:visible');
    await expect(venueTitle).toBeVisible();
    await expect(venueTitle).toHaveText("Test Venue 1");

    // Check that venue map container exists (venue loaded successfully)
    const venueMap = page.locator('[data-testid="venue-map"]:visible');
    await expect(venueMap).toBeVisible();
  });

  test("Test Venue 2 is rendered on secondary test event page", async ({ page }) => {
    await page.goto(`/events/${TEST_EVENTS.SECONDARY}`);
    await page.waitForLoadState("networkidle");

    // Check that venue title link exists on the page (Test Venue 2 has hasPage=true)
    // Use locator that finds visible element (desktop view)
    const venueTitleLink = page.locator('[data-testid="venue-title-link"]:visible');
    await expect(venueTitleLink).toBeVisible();
    await expect(venueTitleLink).toHaveText("Test Venue 2 (Outdoor)");

    // Check that venue map container exists
    const venueMap = page.locator('[data-testid="venue-map"]:visible');
    await expect(venueMap).toBeVisible();
  });

  test("Venue information includes address and city", async ({ page }) => {
    await page.goto(`/events/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");

    // Check for venue address
    // Use locator that finds visible element (desktop view)
    const venueAddress = page.locator('[data-testid="venue-address"]:visible');
    await expect(venueAddress).toBeVisible();
    await expect(venueAddress).toHaveText("Test Address 1, Test District, Osaka");

    // Check for city in page content (city might be in the map overlay)
    const pageContent = await page.textContent("body");
    expect(pageContent?.toLowerCase()).toContain("osaka");
  });

  test("Venue section contains venue information", async ({ page }) => {
    await page.goto(`/events/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");

    // Check that event info section exists
    // Use locator that finds visible element (desktop view)
    const eventInfo = page.locator('[data-testid="event-info"]:visible');
    await expect(eventInfo).toBeVisible();

    // Verify venue title exists
    const venueTitle = page.locator('[data-testid="venue-title"]:visible');
    await expect(venueTitle).toBeVisible();
    await expect(venueTitle).toHaveText("Test Venue 1");
  });

  test("Venue title link behavior on event page depends on hasPage property", async ({ page }) => {
    // Test Venue 1 (no hasPage) - venue title should NOT be a link
    await page.goto(`/events/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");

    // Venue 1 should show as text, not link
    // Use locator that finds visible element (desktop view)
    const venueTitle = page.locator('[data-testid="venue-title"]:visible');
    await expect(venueTitle).toBeVisible();
    await expect(venueTitle).toHaveText("Test Venue 1");

    // Ensure no venue title link exists
    const venueTitleLinkCount = await page.getByTestId("venue-title-link").count();
    expect(venueTitleLinkCount).toBe(0);

    // Test Venue 2 (hasPage=true) - venue title should be a link
    await page.goto(`/events/${TEST_EVENTS.SECONDARY}`);
    await page.waitForLoadState("networkidle");

    // Venue 2 should show as link
    const venueTitleLink = page.locator('[data-testid="venue-title-link"]:visible');
    await expect(venueTitleLink).toBeVisible();
    await expect(venueTitleLink).toHaveText("Test Venue 2 (Outdoor)");
    await expect(venueTitleLink).toHaveAttribute("href", `/venue/${TEST_VENUES.TEST_VENUE_2}`);
  });

  test("Venue maps link to Google Maps", async ({ page }) => {
    // Test that maps link to Google Maps
    await page.goto(`/events/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");

    // Check for venue map link using data-testid
    // Use locator that finds visible element (desktop view)
    const mapLink = page.locator('[data-testid="venue-map-link"]:visible');
    await expect(mapLink).toBeVisible();
    await expect(mapLink).toHaveAttribute("href", "https://maps.app.goo.gl/test1");
    await expect(mapLink).toHaveAttribute("target", "_blank");

    // Test venue 2
    await page.goto(`/events/${TEST_EVENTS.SECONDARY}`);
    await page.waitForLoadState("networkidle");

    const mapLink2 = page.locator('[data-testid="venue-map-link"]:visible');
    await expect(mapLink2).toBeVisible();
    await expect(mapLink2).toHaveAttribute("href", "https://maps.app.goo.gl/test2");
  });
});
