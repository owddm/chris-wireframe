import clsx from "clsx";

import CityBadge from "@/components/Common/CityBadge";
import type { ProcessedVenue } from "@/content";

import VenueMap from "../Venue/VenueMap";

export default function LocationCard({
  below,
  info,
  horizontal = false,
  children,
  venue,
}: {
  venue: ProcessedVenue;
  horizontal?: boolean;
  children: React.ReactNode;
  below?: React.ReactNode;
  info?: React.ReactNode;
}) {
  return (
    <>
      <div className={clsx("glass-card flex", horizontal ? "flex-col sm:flex-row" : "flex-col")}>
        {venue && (
          <div className={clsx("flex", horizontal ? "h-50 sm:h-auto sm:w-90" : "h-60")}>
            <div className="relative flex-grow">
              <div className="absolute inset-0 z-0 overflow-hidden">
                <VenueMap venue={venue} marker={venue?.title} link={true} />
              </div>
              {venue.city && (
                <div className="absolute right-0 bottom-0 z-10">
                  <CityBadge
                    city={venue.city}
                    className="m-0 rounded-tr-none rounded-br-none rounded-bl-none pl-4"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex w-full flex-grow flex-col">
          <div className="flex flex-col justify-center gap-2 p-8">{children}</div>
          {info && <div className="chat-bubble-info hidden px-8 py-4 text-sm md:block">{info}</div>}
        </div>
      </div>
      {info && (
        <div className="chat-bubble-info rounded-box glass-border px-8 py-4 text-sm md:hidden">
          {info}
        </div>
      )}
      {below}
    </>
  );
}
