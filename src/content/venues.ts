import { defineCollection, z, type InferEntrySchema, type CollectionEntry, getEntry, getCollection } from "astro:content";
import path from "path";
import { memoize } from "@/utils/memoize";
import { generateResponsiveImage, type ResponsiveImageData } from "@/utils/responsiveImage";

// Type definitions
export type Venue = InferEntrySchema<"venues">;

// Enhanced venue type with processed map images
export type ProcessedVenue = Omit<Venue, "mapImage" | "mapDarkImage"> & {
  mapImage?: ResponsiveImageData;
  mapDarkImage?: ResponsiveImageData;
};

// Enriched venue type that combines CollectionEntry with processed data
export type VenueEnriched = Omit<CollectionEntry<"venues">, "data"> & {
  data: ProcessedVenue;
};

// Collection definition
export const venuesCollection = defineCollection({
  loader: async () => {
    const imports = import.meta.glob("/content/venues/**/venue.md", {
      eager: true,
    });

    const mapImages = import.meta.glob("/content/venues/**/map.jpg", {
      eager: true,
    });

    const mapDarkImages = import.meta.glob("/content/venues/**/map-dark.jpg", {
      eager: true,
    });

    return Object.entries(imports).map(([fileName, module]) => {
      const basePath = fileName.replace("/venue.md", "");
      const slug = basePath.split("/").pop() as string;

      const { frontmatter } = module as {
        frontmatter: Record<string, unknown>;
      };

      const cover = frontmatter.cover && path.join(basePath, frontmatter.cover as string);

      const mapImagePath = path.join(basePath, "map.jpg");
      const mapImage = mapImages[mapImagePath] ? mapImagePath : undefined;
      
      const mapDarkImagePath = path.join(basePath, "map-dark.jpg");
      const mapDarkImage = mapDarkImages[mapDarkImagePath] ? mapDarkImagePath : undefined;

      return {
        id: slug,
        title: frontmatter.title as string,
        city: frontmatter.city as string | undefined,
        country: frontmatter.country as string | undefined,
        address: frontmatter.address as string | undefined,
        state: frontmatter.state as string | undefined,
        postalCode: frontmatter.postalCode as string | undefined,
        url: frontmatter.url as string | undefined,
        gmaps: frontmatter.gmaps as string | undefined,
        coordinates: frontmatter.coordinates as { lat: number; lng: number } | undefined,
        meetupId: frontmatter.meetupId as number,
        hasPage: frontmatter.hasPage as boolean | undefined,
        description: frontmatter.description as string | undefined,
        cover,
        mapImage,
        mapDarkImage,
      };
    });
  },
  schema: ({ image }) =>
    z.object({
      id: z.string(),
      title: z.string(),
      city: z.string().optional(),
      country: z.string().optional(),
      address: z.string().optional(),
      state: z.string().optional(),
      postalCode: z.string().optional(),
      url: z.string().optional(),
      gmaps: z.string().optional(),
      coordinates: z
        .object({
          lat: z.number(),
          lng: z.number(),
        })
        .optional(),
      meetupId: z.number(),
      hasPage: z.boolean().optional(),
      description: z.string().optional(),
      cover: image().optional(),
      mapImage: image().optional(),
      mapDarkImage: image().optional(),
    }),
});

// Helper function to process venue with map image
const processVenue = memoize(async function processVenue(
  venue: CollectionEntry<"venues">,
): Promise<ProcessedVenue> {
  let mapImage: ResponsiveImageData | undefined;
  let mapDarkImage: ResponsiveImageData | undefined;

  if (venue.data.mapImage) {
    mapImage = await generateResponsiveImage(
      venue.data.mapImage,
      "venueMap"
    );
  }

  if (venue.data.mapDarkImage) {
    mapDarkImage = await generateResponsiveImage(
      venue.data.mapDarkImage,
      "venueMap"
    );
  }

  return {
    ...venue.data,
    mapImage,
    mapDarkImage,
  };
});

// Export memoized functions
export const getVenues = memoize(async (): Promise<CollectionEntry<"venues">[]> => {
  const venues = await getCollection("venues");
  // Only return venues that have a page
  return venues.filter((venue) => venue.data.hasPage);
});

export const getVenue = memoize(
  async (venueSlug: string | undefined): Promise<VenueEnriched> => {
  if (!venueSlug) {
    throw "Venue slug not defined";
  }
  const venue = await getEntry("venues", venueSlug);
  if (!venue) {
    throw `No venue found for slug ${venueSlug}`;
  }

  // Process venue to include map image
  const processedVenueData = await processVenue(venue);

    return {
      ...venue,
      data: processedVenueData,
    };
  },
);

export { processVenue };