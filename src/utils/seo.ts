import { getEntry } from "astro:content";

import { SEO_DATA, SITE } from "@/constants";
import { type EventEnriched, getEvent, getVenue } from "@/content";
import { type VenueEnriched } from "@/content/venues";
import { isLegacyEvent } from "@/utils/eventFilters";
import { getOGImageWithFallback } from "@/utils/og";
import { extractPathname, resolveFullUrl } from "@/utils/urlResolver";

export interface SEOMetadata {
  title: string; // Plain title without site suffix
  fullTitle: string; // Full title with site suffix for SEO
  description: string;
  canonical: string;
  ogImage?: string;
  type: "website" | "article" | "profile";
  article?: {
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
  };
  noindex?: boolean;
  nofollow?: boolean;
  keywords?: string[];
  // Additional data for OG image generation
  entity?: {
    type: "event" | "venue";
    data: EventEnriched | VenueEnriched;
    isLegacy?: boolean;
    shouldGenerateOG?: boolean;
  };
}

/**
 * Extracts entity ID from URL path
 */
function extractEntityId(url: string, pattern: RegExp): string | null {
  const match = url.match(pattern);
  return match?.[1] || null;
}

/**
 * Extract plain text from markdown content for description
 */
async function extractMarkdownDescription(
  collection: string,
  entryId: string,
  maxLength: number = 160,
): Promise<string | null> {
  try {
    const entry = await getEntry(collection as any, entryId);
    if (!entry) return null;

    // Get the raw markdown body
    const body = entry.body || "";

    // Remove frontmatter if present
    const content = body.replace(/^---[\s\S]*?---\n/, "");

    // Remove markdown formatting
    let plainText = content
      .replace(/#{1,6}\s+/g, "") // Headers
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
      .replace(/\*([^*]+)\*/g, "$1") // Italic
      .replace(/_([^_]+)_/g, "$1") // Italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1") // Links
      .replace(/!\[([^\]]*)\]\([^)]+\)/g, "") // Images
      .replace(/```[\s\S]*?```/g, "") // Code blocks
      .replace(/`([^`]+)`/g, "$1") // Inline code
      .replace(/^[-*+]\s+/gm, "") // Bullet points
      .replace(/^\d+\.\s+/gm, "") // Numbered lists
      .replace(/^>\s+/gm, "") // Blockquotes
      .replace(/\n{2,}/g, " ") // Multiple newlines
      .replace(/\n/g, " ") // Single newlines
      .trim();

    // Take the first few sentences or characters
    if (plainText.length > maxLength) {
      // Try to cut at a sentence boundary
      const sentences = plainText.match(/[^.!?]+[.!?]+/g) || [];
      let description = "";

      for (const sentence of sentences) {
        if ((description + sentence).length <= maxLength) {
          description += sentence;
        } else if (description.length < 50) {
          // If we don't have enough content, just truncate
          description = plainText.substring(0, maxLength - 3) + "...";
          break;
        } else {
          break;
        }
      }

      return description || plainText.substring(0, maxLength - 3) + "...";
    }

    return plainText;
  } catch (error) {
    console.error(`Failed to extract markdown for ${collection}/${entryId}:`, error);
    return null;
  }
}

/**
 * Determine SEO metadata based on URL
 */
export async function getSEO(url: string): Promise<SEOMetadata> {
  // Extract and normalize pathname using our URL helpers
  const pathname = extractPathname(url);
  const canonical = resolveFullUrl(pathname);

  // Check if this is a static page with SEO data
  const staticSEO = SEO_DATA[pathname];
  if (staticSEO) {
    // Don't generate SEO meta tags for non-HTML resources
    const isNonHtml = pathname.endsWith(".xml") || pathname.endsWith(".ics");
    if (isNonHtml) {
      // Return minimal SEO for non-HTML resources (they won't use it anyway)
      return {
        title: staticSEO.title,
        fullTitle: SITE.title.default,
        description: staticSEO.description,
        canonical,
        type: "website",
        noindex: true,
      };
    }

    // Determine the title
    const fullTitle =
      pathname === "/" ? SITE.title.default : SITE.title.template.replace("%s", staticSEO.title);

    return {
      title: staticSEO.title,
      fullTitle,
      description: staticSEO.description,
      canonical,
      ogImage: getOGImageWithFallback(pathname),
      type: "website",
      keywords: staticSEO.keywords,
    };
  }

  // Individual event page
  const eventId = extractEntityId(pathname, /^\/events\/([^/]+)$/);
  if (eventId) {
    try {
      const event = await getEvent(eventId);
      const topics = event.data.topics || [];

      // Try to get description from markdown content
      let description = await extractMarkdownDescription("eventsMarkdown", eventId);

      // Fallback to topics if no markdown or too short
      if (!description || description.length < 50) {
        description = topics.length
          ? `Topics: ${topics.join(", ")}. Join us for this tech meetup event!`
          : "Join us for this exciting tech meetup event in the Osaka-Kyoto region!";
      }

      const isLegacy = isLegacyEvent(event);
      // For legacy events, use their cover image if available
      const ogImage =
        isLegacy && event.data.cover?.src
          ? event.data.cover.src
          : getOGImageWithFallback(pathname, { eventId, title: event.data.title });

      return {
        title: event.data.title,
        fullTitle: SITE.title.template.replace("%s", `${event.data.title} - Events`),
        description,
        canonical,
        ogImage,
        type: "article",
        article: {
          publishedTime: event.data.dateTime.toISOString(),
          tags: topics,
        },
        keywords: [...topics, "tech event", "meetup", event.venue?.title].filter(
          Boolean,
        ) as string[],
        entity: {
          type: "event",
          data: event,
          isLegacy,
          shouldGenerateOG: !isLegacy, // Generate OG for non-legacy events
        },
      };
    } catch (error) {
      console.error(`Failed to load event ${eventId}:`, error);
    }
  }

  // Individual venue page
  const venueId = extractEntityId(pathname, /^\/venue\/([^/]+)$/);
  if (venueId) {
    try {
      const venue = await getVenue(venueId);

      // Try to get description from markdown content or use venue description
      let description = await extractMarkdownDescription("venuesMarkdown", venueId);

      // Fallback to venue description field or default
      if (!description) {
        description =
          venue.data.description ||
          `${venue.data.title} - A venue for tech meetups and events in the Kansai region. Located in ${venue.data.city || "Osaka"}.`;
      }

      // Use venue's cover image if it exists, otherwise generate OG image
      const ogImage = venue.data.cover?.src
        ? venue.data.cover.src
        : getOGImageWithFallback(pathname, { venueId, title: venue.data.title });

      return {
        title: venue.data.title,
        fullTitle: SITE.title.template.replace("%s", `${venue.data.title} - Venues`),
        description,
        canonical,
        ogImage,
        type: "website",
        keywords: ["venue", venue.data.title, venue.data.city, "tech meetup venue"].filter(
          Boolean,
        ) as string[],
        entity: {
          type: "venue",
          data: venue,
          shouldGenerateOG: !venue.data.cover?.src, // Only generate OG if no cover image
        },
      };
    } catch (error) {
      console.error(`Failed to load venue ${venueId}:`, error);
    }
  }

  // Default fallback for any other pages - use home page SEO
  const homeSEO = SEO_DATA["/"];
  return {
    title: "OKTech",
    fullTitle: SITE.title.default,
    description:
      homeSEO?.description ||
      "Join the Osaka Kyoto Tech Meetup Group - A vibrant community for tech enthusiasts.",
    canonical,
    ogImage: getOGImageWithFallback(pathname),
    type: "website",
    keywords: homeSEO?.keywords || ["tech meetup", "osaka", "kyoto"],
  };
}
