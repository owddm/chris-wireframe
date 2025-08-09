import clsx from "clsx";

import CityBadge from "@/components/Common/CityBadge";
import Link from "@/components/Common/LinkReact";
import type { EventEnriched } from "@/content";
import { useViewportPrefetch } from "@/utils/useViewportPrefetch";

import EventCardDescription from "./EventCardDescription";
import EventCardImage from "./EventCardImage";

type Variant = "compact" | "polaroid" | "big";

export default function EventCard({
  event,
  index,
  variant = "compact",
}: {
  event: EventEnriched;
  index?: number;
  variant?: Variant;
}) {
  const odd = index !== undefined && index % 2 === 1;
  const border = index === undefined;
  const eventUrl = `/event/${event.id}`;
  // Only enable prefetching in production
  const isProd = typeof window !== "undefined" && window.location.hostname !== "localhost";
  const prefetchRef = useViewportPrefetch(eventUrl, isProd);

  return (
    <Link
      ref={prefetchRef}
      href={eventUrl}
      className={clsx(
        "hover:bg-base-100/100 glass-border transition-all duration-200",
        border && "rounded-box overflow-hidden",
        !border && "border-t-0 border-r-0 border-l-0",
        odd ? "bg-base-100/30" : "bg-base-100/60",
        variant === "compact" && "flex items-center",
        variant === "polaroid" && "flex flex-col",
        variant === "big" && "flex flex-col sm:grid sm:grid-cols-2",
      )}
      data-testid={`event-card-${event.id}`}
    >
      <EventCardImage
        event={event}
        variant={variant}
        cityComponent={
          <CityBadge
            city={event.venue?.city}
            className="rounded-tr-none rounded-br-none rounded-bl-none pl-4"
          />
        }
      />
      <EventCardDescription event={event} variant={variant} />
    </Link>
  );
}

export function EventCardList({ events }: { events: EventEnriched[] }) {
  return (
    <div className={"glass-border rounded-box overflow-hidden"}>
      {events.map((event, index) => (
        <EventCard key={event.id} variant="compact" event={event} index={index} />
      ))}
    </div>
  );
}
