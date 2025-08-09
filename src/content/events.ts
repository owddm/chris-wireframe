import { defineCollection, reference, z, type CollectionEntry, getEntry, getCollection } from "astro:content";
import path from "path";
import { memoize } from "@/utils/memoize";
import { DEV_MODE } from "@/constants";
import { processVenue, type ProcessedVenue } from "./venues";
import { generateResponsiveImage, type ResponsiveImageData } from "@/utils/responsiveImage";

// Type definitions
export type GalleryImage = CollectionEntry<"eventGalleryImage"> & {
  thumbnail: ResponsiveImageData;
  full: ResponsiveImageData;
};

// Enriched event type that combines CollectionEntry with processed data
export type EventEnriched = Omit<CollectionEntry<"events">, "data"> & {
  data: Omit<CollectionEntry<"events">["data"], "cover"> & {
    cover: ResponsiveImageData;
  };
  venue?: ProcessedVenue;
  venueSlug?: string;
  galleryImages?: GalleryImage[];
  priority?: boolean; // For image loading optimization
};


// Events collection definition
export const eventsCollection = defineCollection({
  loader: async () => {
    const imports = import.meta.glob("/content/events/**/event.md", { eager: true });
    return Object.entries(imports).map(([fileName, module]) => {
      const basePath = fileName.replace("/event.md", "");
      const slug = basePath.split("/").pop() as string;
      const { frontmatter } = module as {
        frontmatter: Record<string, unknown>;
      };
      const cover = frontmatter.cover && path.join(basePath, frontmatter.cover as string);
      const [date, time] = (frontmatter.dateTime as string).split(" ");
      const devOnly = frontmatter.devOnly as boolean | undefined;

      // Convert venue number to string if it exists
      const venueId = frontmatter.venue;
      const venue = venueId ? String(venueId) : undefined;

      return {
        id: slug,
        cover,
        title: frontmatter.title as string,
        // Convert to UTC from JST (+09:00),
        dateTime: new Date(`${date}T${time}:00+09:00`),
        duration: frontmatter.duration,
        devOnly: devOnly ?? false,
        venue,
        topics: frontmatter.topics as string[] | undefined,
        howToFindUs: frontmatter.howToFindUs as string | undefined,
        meetupId: frontmatter.meetupId as number | undefined,
      };
    });
  },
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      dateTime: z.date(),
      duration: z.number().optional(),
      cover: image(),
      devOnly: z.boolean().optional().default(false),
      venue: reference("venues").optional(),
      topics: z.array(z.string()).optional(),
      howToFindUs: z.string().optional(),
      meetupId: z.number().optional(),
    }),
});

// Event gallery images collection definition
export const eventGalleryImageCollection = defineCollection({
  loader: async () => {
    const [images, metadata] = await Promise.all([
      import.meta.glob("/content/events/**/gallery/*.{webp,jpg,jpeg,png,gif,svg}", {
        eager: true,
      }),
      import.meta.glob("/content/events/**/gallery/*.yaml", { eager: true }),
    ]);

    return Object.entries(images).map(([id]) => {
      const metaDataPath = `${id}.yaml`;
      const metaDataModule = metadata[metaDataPath] as
        | { default: Record<string, unknown> }
        | undefined;
      const imageMetadata = metaDataModule?.default as Record<string, unknown>;
      const event = id.split("/").slice(0, -2).pop();
      return { ...imageMetadata, id, event, image: id };
    });
  },
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      image: image(),
      event: reference("events"),
      caption: z.string().optional(), // todo add more metadatas?
    }),
});


// Helper function to get gallery images with responsive data
export const getGalleryImages = memoize(async (eventId: string): Promise<GalleryImage[]> => {
  const allGalleryImages = await getCollection("eventGalleryImage");
  const eventGalleryImages = allGalleryImages.filter((img) => img.data.event.id === eventId);
  
  return await Promise.all(
    eventGalleryImages.map(async (img) => {
      // Generate responsive data for thumbnail and full images
      const [thumbnail, full] = await Promise.all([
        generateResponsiveImage(
          img.data.image,
          "galleryThumbnail"
        ),
        generateResponsiveImage(
          img.data.image,
          "galleryLightbox"
        )
      ]);
      
      return {
        ...img,
        thumbnail,
        full,
      };
    })
  );
});

// Export memoized functions
export const getEvents = memoize(async (): Promise<EventEnriched[]> => {
  const allEvents = await getCollection("events");

  // Filter out devOnly events in production
  const filteredEvents = DEV_MODE ? allEvents : allEvents.filter((event) => !event.data.devOnly);

  // Enrich each event with venue and gallery data using getEvent logic
  const enrichedEvents = await Promise.all(filteredEvents.map((event) => getEvent(event.id)));

  // Sort events by date (newest first) and add priority flag for first 16
  const sortedEvents = enrichedEvents.sort((a, b) => {
    const dateA = new Date(a.data.dateTime).getTime();
    const dateB = new Date(b.data.dateTime).getTime();
    return dateB - dateA;
  });

  // Add priority flag to first 16 events for optimized image loading
  return sortedEvents.map((event, index) => ({
    ...event,
    priority: index < 16
  }));
});

export const getEvent = memoize(async (eventSlug: string): Promise<EventEnriched> => {

  const event = await getEntry("events", eventSlug);

  if (!event) {
    throw `No event found for slug ${eventSlug}`;
  }

  // Get venue data if the event has a venue reference
  let processedVenue: ProcessedVenue | undefined;
  let venueSlug: string | undefined;
  if (event.data.venue) {
    const venues = await getCollection("venues");
    // Handle both object with id and plain number/string
    const venueId = typeof event.data.venue === "object" ? event.data.venue.id : event.data.venue;
    const venue = venues.find((v) => v.data.meetupId.toString() === venueId?.toString());
    if (venue) {
      processedVenue = await processVenue(venue);
      venueSlug = venue.id;
    }
  }

  // Get gallery images for this event with responsive data
  const galleryImages = await getGalleryImages(event.id);
  
  // Generate responsive cover image
  const cover = await generateResponsiveImage(
    event.data.cover,
    "eventPolaroid"
  );

  return {
    ...event,
    data: {
      ...event.data,
      cover,
    },
    venue: processedVenue,
    venueSlug,
    galleryImages,
  };
});

