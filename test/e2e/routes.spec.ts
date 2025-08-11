import { expect, test } from "@playwright/test";

import { TEST_EVENTS, TEST_VENUES } from "../helpers/url";

// Static routes tests
test.describe("Static Routes", () => {
  test("Homepage loads with correct title", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle("OKTech - Osaka Kyoto Tech Meetup Group");
    await expect(page.getByTestId("landing-hero-title")).toContainText("Welcome to the homepage");
  });

  test("About page loads with correct title", async ({ page }) => {
    await page.goto("/about");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/About.*OKTech/);
  });

  test("Sitemap HTML page loads", async ({ page }) => {
    await page.goto("/sitemap");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/Sitemap.*OKTech/);
  });
});

// Dynamic routes tests - one example for each type
test.describe("Dynamic Routes", () => {
  test("Events page loads with correct title", async ({ page }) => {
    await page.goto("/events");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/Events.*OKTech/);
  });

  test("Individual event page loads with correct title", async ({ page }) => {
    await page.goto(`/events/${TEST_EVENTS.PRIMARY}`);
    await page.waitForLoadState("networkidle");
    // Event pages typically have the event name in the title
    await expect(page).toHaveTitle(/Future Test Event 1.*OKTech/);
  });

  test("Individual venue page loads with correct title", async ({ page }) => {
    // Use TEST_VENUE_2 which has hasPage: true
    await page.goto(`/venue/${TEST_VENUES.TEST_VENUE_2}`);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveTitle(/Test Venue 2.*Venues.*OKTech/);
  });
});

// Special routes tests
test.describe("Special Routes", () => {
  test("RSS feed is accessible", async ({ page }) => {
    const response = await page.goto("/rss.xml");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toMatch(/xml/);
  });

  test("XML sitemap is accessible", async ({ page }) => {
    const response = await page.goto("/sitemap.xml");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toMatch(/xml/);
  });

  test("Homepage OG image is accessible", async ({ page }) => {
    const response = await page.goto("/og.png");
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain("image/png");
  });

  test("Event OG image is accessible", async ({ page }) => {
    const response = await page.goto(`/events/${TEST_EVENTS.PRIMARY}/og.png`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain("image/png");
  });

  test("Venue OG image is accessible", async ({ page }) => {
    // Use TEST_VENUE_2 which has hasPage: true
    const response = await page.goto(`/venue/${TEST_VENUES.TEST_VENUE_2}/og.png`);
    expect(response?.status()).toBe(200);
    expect(response?.headers()["content-type"]).toContain("image/png");
  });
});
