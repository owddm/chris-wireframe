import type { EventEnriched } from "@/content";
import { filterUpcomingEvents } from "@/utils/eventFilters";

import SimpleSection from "../Common/SimpleSection";
import EventsRecent from "./EventsRecent";
import EventsUpcoming from "./EventsUpcoming";

interface EventsSectionProps {
  events: EventEnriched[];
  variant: "upcoming" | "recent";
}

function UpcomingSection({ events }: { events: EventEnriched[] }) {
  return (
    <SimpleSection title="Upcoming Events">
      <EventsUpcoming events={events} />
    </SimpleSection>
  );
}

function RecentSection({ events }: { events: EventEnriched[] }) {
  return (
    <SimpleSection title="Recent Events" wide button={{ text: "All Events", href: "/events" }}>
      <EventsRecent events={events} />
    </SimpleSection>
  );
}

export default function EventsSection({ events, variant }: EventsSectionProps) {
  const hasUpcoming = filterUpcomingEvents(events).length > 0;

  // show the recent events, or upcoming if there aren't any recents.

  if (variant === "upcoming") {
    return hasUpcoming ? <UpcomingSection events={events} /> : <RecentSection events={events} />;
  }
  if (variant === "recent") {
    return hasUpcoming ? <RecentSection events={events} /> : null;
  }
}
