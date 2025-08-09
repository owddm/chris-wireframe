import { LuTicket } from "react-icons/lu";

import type { EventEnriched } from "@/content/events";
import { isEventUpcoming } from "@/utils/eventFilters";

const MEETUP_BASE_URL = "https://www.meetup.com/osaka-web-designers-and-developers-meetup";
const MEETUP_EVENT_URL = `${MEETUP_BASE_URL}/events`;

interface EventJoinButtonProps {
  event: EventEnriched;
}

export default function EventJoinButton({ event }: EventJoinButtonProps) {
  // Get meetupId from event data
  const meetupId = event.data.meetupId;

  // Construct Meetup.com URL
  const meetupUrl = meetupId ? `${MEETUP_EVENT_URL}/${meetupId}` : MEETUP_BASE_URL;

  // Determine button text based on event status
  const buttonText = isEventUpcoming(event) ? "RSVP Now" : "View on Meetup";

  return (
    <a
      href={meetupUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="btn btn-primary btn-lg w-full gap-4"
    >
      {buttonText}
      <LuTicket />
    </a>
  );
}
