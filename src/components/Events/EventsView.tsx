import { useEventsFilter } from "@/components/Events/EventsFilterProvider";
import type { EventEnriched } from "@/content";

import EventsViewAlbum from "./EventsViewAlbum";
import EventsViewCompact from "./EventsViewCompact";
import EventsViewGrid from "./EventsViewGrid";

interface Props {
  events: EventEnriched[];
  view: "grid" | "compact" | "album";
}

export default function EventsView({ events, view }: Props) {
  const { filteredItems } = useEventsFilter();

  // Create a map of filtered event IDs for quick lookup
  const filteredIds = new Set(filteredItems.map((item) => item.id));

  // Filter the full event objects based on filtered IDs
  const filteredEvents = events.filter((event) => filteredIds.has(event.id));

  // Sort the filtered events to match the order from filteredItems
  const sortedEvents = filteredItems
    .map((item) => filteredEvents.find((event) => event.id === item.id))
    .filter((event): event is EventEnriched => event !== undefined);

  return (
    <div className="my-24 flex flex-col gap-24">
      {view === "grid" && <EventsViewGrid events={sortedEvents} />}
      {view === "compact" && <EventsViewCompact events={sortedEvents} />}
      {view === "album" && <EventsViewAlbum events={sortedEvents} />}
    </div>
  );
}
