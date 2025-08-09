import type { APIRoute, GetStaticPaths } from "astro";

import OGVenue from "@/components/OG/OGVenue";
import { getVenue, getVenues } from "@/content";
import { createOGImageHandler } from "@/utils/og";

export const GET: APIRoute = async ({ params }) => {
  const venueSlug = params.venueSlug;

  // Get venue data
  const venue = await getVenue(venueSlug);

  if (!venue) {
    return new Response("Not found", { status: 404 });
  }

  return createOGImageHandler({
    component: OGVenue,
    props: { venue },
  });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const venues = await getVenues();
  return venues.map((venue) => ({
    params: { venueSlug: venue.id },
  }));
};
