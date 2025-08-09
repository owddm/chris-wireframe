import type { EventEnriched } from "@/content";
import { groupEventsByYearAndUpcoming } from "@/utils/eventGrouping";

import SimpleSection from "../Common/SimpleSection";
import { EventCardList } from "../EventCard/EventCard";
import { useEventsFilter } from "./EventsFilterProvider";

interface Props {
  events: EventEnriched[];
}

export default function EventsViewCompact({ events }: Props) {
  const { currentFilters } = useEventsFilter();
  const eventGroups = groupEventsByYearAndUpcoming(events, currentFilters.sort);

  return (
    <>
      {eventGroups.map((group) => (
        <SimpleSection key={group.label} title={group.label}>
          <EventCardList events={group.events} />
        </SimpleSection>
      ))}
    </>
  );
}
