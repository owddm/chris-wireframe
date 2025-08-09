import type { EventEnriched } from "@/content";

// an event is considered "ended" if it has ended + 30 min buffer
const BUFFER_MINUTES = 30;

/**
 * Calculates the end time of an event including a buffer period
 */
export function getEventEndTimeWithBuffer(event: EventEnriched): Date {
  const startTime = new Date(event.data.dateTime);
  const durationMinutes = event.data.duration || 120; // Default 2 hours if not specified
  const totalMinutes = durationMinutes + BUFFER_MINUTES;

  return new Date(startTime.getTime() + totalMinutes * 60 * 1000);
}

/**
 * Checks if an event should be shown as upcoming
 * Events are considered upcoming if they haven't ended (including 30 min buffer)
 */
export function isEventUpcoming(event: EventEnriched, currentTime: Date = new Date()): boolean {
  const endTimeWithBuffer = getEventEndTimeWithBuffer(event);
  return endTimeWithBuffer > currentTime;
}

/**
 * Checks if an event should be shown as recent
 * Events are considered recent if they have ended (including 30 min buffer)
 */
export function isEventRecent(event: EventEnriched, currentTime: Date = new Date()): boolean {
  const endTimeWithBuffer = getEventEndTimeWithBuffer(event);
  return endTimeWithBuffer <= currentTime;
}

/**
 * Filters events to get upcoming ones (haven't ended + 30 min buffer)
 */
export function filterUpcomingEvents(
  events: EventEnriched[],
  currentTime: Date = new Date(),
): EventEnriched[] {
  return events.filter((event) => isEventUpcoming(event, currentTime));
}

/**
 * Filters events to get recent ones (have ended + 30 min buffer)
 */
export function filterRecentEvents(
  events: EventEnriched[],
  currentTime: Date = new Date(),
): EventEnriched[] {
  return events.filter((event) => isEventRecent(event, currentTime));
}
