import type { APIRoute, GetStaticPaths } from "astro";
import path from "path";

import OGEvent from "@/components/OG/OGEvent";
import { getEvents } from "@/content";
import { isLegacyEvent } from "@/utils/eventFilters";
import { createOGImageHandler, loadImageAsBase64 } from "@/utils/og";

export const GET: APIRoute = async ({ params }) => {
  const eventSlug = params.eventSlug;

  if (!eventSlug) {
    return new Response("Event slug is required", { status: 400 });
  }

  // Get event data
  const events = await getEvents();
  const event = events.find((e) => e.id === eventSlug);

  if (!event) {
    return new Response("Not found", { status: 404 });
  }

  // Skip generation for legacy events
  if (isLegacyEvent(event)) {
    return new Response("Not found", { status: 404 });
  }

  // Get local map image if venue has one
  let mapImageBase64 = null;
  if (event.venue?.id) {
    const mapPath = path.join(process.cwd(), "content", "venues", event.venue.id, "map.jpg");
    mapImageBase64 = await loadImageAsBase64(mapPath);
  }

  // Get event cover image if it exists
  let coverImageBase64 = null;
  if (event.data.cover) {
    // Extract the actual file path from the Vite virtual file system path
    const coverSrc = event.data.cover.src;
    const match = coverSrc.match(/\/@fs(.+?)\?/);
    if (match) {
      const actualPath = match[1];
      coverImageBase64 = await loadImageAsBase64(actualPath);
    }
  }

  return createOGImageHandler({
    component: OGEvent,
    props: {
      event,
      mapImageBase64,
      coverImageBase64,
    },
  });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const events = await getEvents();
  return events.map((event) => ({
    params: { eventSlug: event.id },
  }));
};
