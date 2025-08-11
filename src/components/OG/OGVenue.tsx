import { twj } from "tw-to-css";

import { themeColorsHex } from "@/utils/og/theme-colors";

import OGLayout, { IconWrapper, LocationIcon } from "./OGLayout";

interface VenueData {
  data: {
    title: string;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
}

interface OGVenueProps {
  venue: VenueData;
}

export default function OGVenue({ venue }: OGVenueProps) {
  const colors = themeColorsHex.light;
  // Create location string
  const locationParts = [
    venue.data.address,
    venue.data.city,
    venue.data.state,
    venue.data.country,
  ].filter(Boolean);
  const location = locationParts.join(", ");

  return (
    <OGLayout title={venue.data.title} subtitle="Event Venue">
      <div style={twj("flex flex-col gap-6")}>
        {location && (
          <div style={twj("flex items-center gap-4")}>
            <IconWrapper>
              <LocationIcon />
            </IconWrapper>
            <span
              style={{
                ...twj("text-[20px]"),
                color: colors.baseContent,
                opacity: 0.8,
              }}
            >
              {location}
            </span>
          </div>
        )}

        <div style={twj("flex flex-col gap-3")}>
          <p
            style={{
              ...twj("text-xl leading-relaxed"),
              color: colors.baseContent,
              opacity: 0.7,
            }}
          >
            Host venue for OKTech community events and meetups.
          </p>
          <p
            style={{
              ...twj("text-lg"),
              color: colors.baseContent,
              opacity: 0.6,
            }}
          >
            Join us at this location for networking, learning, and collaboration.
          </p>
        </div>
      </div>
    </OGLayout>
  );
}
