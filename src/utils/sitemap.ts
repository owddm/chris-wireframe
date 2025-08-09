import { getEvents, getVenues } from "@/content";

import { resolveFullUrl } from "./urlResolver";

export interface PageEntry {
  href: string;
  title: string;
}

export interface Entry {
  title: string;
  href?: string;
  children: PageEntry[];
}

/**
 * Build organized sections for the sitemap
 */
export async function buildSitemapSections(): Promise<Entry[]> {
  const sections: Entry[] = [];

  // Home section (single link)
  sections.push({
    title: "Home",
    href: "/",
    children: [],
  });
  // About and other static pages
  sections.push({
    title: "About",
    href: "/about",
    children: [],
  });

  // Events section
  const events = await getEvents();
  const eventPages: PageEntry[] = events
    .map((e) => ({
      href: `/event/${e.id}`,
      title: e.data.title,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  sections.push({
    title: "Events",
    href: "/events",
    children: [
      { href: "/events/list", title: "Events (List View)" },
      { href: "/events/album", title: "Photo Album" },
      ...eventPages,
    ],
  });

  // Venues section
  const venues = await getVenues();
  const venuePages: PageEntry[] = venues
    .map((v) => ({
      href: `/venue/${v.id}`,
      title: v.data.title,
    }))
    .sort((a, b) => a.title.localeCompare(b.title));

  sections.push({
    title: "Venues",
    children: venuePages,
  });

  sections.push({
    title: "Code of Conduct",
    href: "/code-of-conduct",
    children: [],
  });

  sections.push({
    title: "RSS Feed",
    href: "/rss.xml",
    children: [],
  });

  sections.push({
    title: "ICS Calendar Feed",
    href: "/oktech-events.ics",
    children: [],
  });

  sections.push({
    title: "Sitemap",
    href: "/sitemap",
    children: [{ href: "/sitemap.xml", title: "XML Sitemap" }],
  });

  return sections;
}

/**
 * Extract all URLs from sitemap sections (recursively)
 */
export function extractUrlsFromSections(sections: Entry[]): string[] {
  const urls: string[] = [];

  for (const section of sections) {
    if (section.href) {
      urls.push(section.href);
    }
    for (const child of section.children) {
      urls.push(child.href);
    }
  }

  return urls;
}

/**
 * Generate a list of absolute URLs used in sitemaps.
 * Uses resolveFullUrl to ensure consistent URL generation.
 *
 * @returns Array of URL strings.
 */
export async function generateSitemapURLs(): Promise<string[]> {
  const sections = await buildSitemapSections();
  const paths = extractUrlsFromSections(sections);

  // Filter out non-HTML paths (XML, RSS, ICS)
  const htmlPaths = paths.filter((path) => !path.endsWith(".xml") && !path.endsWith(".ics"));

  // Convert to absolute URLs
  return htmlPaths.map((path) => resolveFullUrl(path));
}
