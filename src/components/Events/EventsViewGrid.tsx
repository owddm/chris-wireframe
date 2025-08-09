import type { EventEnriched } from "@/content";
import { groupEventsByYearAndUpcoming } from "@/utils/eventGrouping";

import SimpleSection from "../Common/SimpleSection";
import EventCard from "../EventCard/EventCard";
import { useEventsFilter } from "./EventsFilterProvider";

interface Props {
  events: EventEnriched[];
}

export default function EventsViewGrid({ events }: Props) {
  const { currentFilters } = useEventsFilter();
  const eventGroups = groupEventsByYearAndUpcoming(events, currentFilters.sort);

  return (
    <>
      {eventGroups.map((group) => (
        <SimpleSection key={group.label} title={group.label} wide grid>
          {group.events.map((event) => (
            <div key={event.id} data-testid="event-card">
              <EventCard event={event} variant="polaroid" />
            </div>
          ))}
        </SimpleSection>
      ))}
    </>
  );
}
