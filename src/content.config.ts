import { glob } from "astro/loaders";
import { defineCollection } from "astro:content";

import { eventGalleryImageCollection, eventsCollection } from "./content/events";
import { venuesCollection } from "./content/venues";

// we fetch markdown separately from the main collections

// parent folder is the id for markdown files
const getMarkdownId = ({ entry }: { entry: string }) => {
  const pathParts = entry.split("/");
  return pathParts[pathParts.length - 2];
};

const eventsMarkdown = defineCollection({
  loader: glob({
    pattern: "**/event.md",
    base: "./content/events",
    generateId: getMarkdownId,
  }),
});

const venuesMarkdown = defineCollection({
  loader: glob({
    pattern: "**/venue.md",
    base: "./content/venues",
    generateId: getMarkdownId,
  }),
});

export const collections = {
  eventsMarkdown,
  venuesMarkdown,
  events: eventsCollection,
  eventGalleryImage: eventGalleryImageCollection,
  venues: venuesCollection,
};
