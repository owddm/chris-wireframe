/**
 * URL helper for Playwright tests
 * Contains test constants for development-only events and venues
 */

// Test event constants - these are development-only events that should be used in tests
export const TEST_EVENTS = {
  PRIMARY: "999999999-example-dev-event",
  SECONDARY: "999999998-example-dev-event-2",
} as const;

// Test venue constants that are used by test events
export const TEST_VENUES = {
  TEST_VENUE_1: "999999997-test-venue-1", // Used by PRIMARY test event
  TEST_VENUE_2: "999999996-test-venue-2", // Used by SECONDARY test event
} as const;
