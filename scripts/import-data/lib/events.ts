import matter from "gray-matter";
import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import slugify from "slugify";

import { EVENTS_BASE_DIR } from "./constants";
import { logger } from "./logger";
import { processGallery } from "./photos";
import type { ImportStatistics } from "./statistics";
import type { Event, Photo } from "./types";
import { downloadImage } from "./utils";
import { doubleQuoteYamlEngine } from "./yaml-engine";

export async function processEvent(
  event: Event,
  group: string,
  photos: Photo[],
  stats: ImportStatistics,
): Promise<void> {
  const slug = slugify(`${event.id}-${event.title}`, { lower: true, strict: true });
  const eventDir = path.join(EVENTS_BASE_DIR, slug);
  await fs.mkdir(eventDir, { recursive: true });
  const mdPath = path.join(EVENTS_BASE_DIR, slug, "event.md");

  const date = new Date(event.time).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Tokyo",
  });
  const time = new Date(event.time).toLocaleTimeString("en-CA", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Tokyo",
  });
  const dateTime = `${date} ${time}`;

  const newFrontmatter: Record<string, unknown> = {
    title: event.title.trim(),
    dateTime,
  };

  if (event.duration) {
    newFrontmatter.duration = Math.round(event.duration / 60000);
  }

  if (event.image && event.image.location) {
    const coverBasename = path.basename(event.image.location);
    const coverLocalPath = path.join(eventDir, coverBasename);
    try {
      await downloadImage(event.image.location, coverLocalPath); // Cover images don't track stats
      // Only set cover in frontmatter if download succeeded
      newFrontmatter.cover = `./${coverBasename}`;
    } catch (err) {
      logger.warn(`Failed to download cover image for event ${event.id}: ${err}`);
      // Don't set cover in frontmatter if download failed
    }
  }

  if (event.topics && event.topics.length > 0) {
    newFrontmatter.topics = event.topics;
  }

  newFrontmatter.meetupId = parseInt(event.id);
  newFrontmatter.group = parseInt(group);
  newFrontmatter.venue = parseInt(event.venue);

  if (event.howToFindUs) {
    newFrontmatter.howToFindUs = event.howToFindUs;
  }

  if (existsSync(mdPath)) {
    const existing = matter.read(mdPath);
    const { description, ...existingWithoutDescription } = existing.data;
    const currentDescription = event.description ?? description ?? "";
    const merged = { ...existingWithoutDescription, ...newFrontmatter };

    const content = matter.stringify(`\n${currentDescription}`, merged, {
      engines: { yaml: doubleQuoteYamlEngine },
    });
    const existingContent = await fs.readFile(mdPath, "utf-8");
    if (content !== existingContent) {
      await fs.writeFile(mdPath, content);
      logger.info(`Updated markdown → ${mdPath}`);
      stats.markdownUpdated++;
    } else {
      stats.markdownUnchanged++;
    }
  } else {
    const content = matter.stringify(`\n${event.description || ""}`, newFrontmatter, {
      engines: { yaml: doubleQuoteYamlEngine },
    });
    await fs.writeFile(mdPath, content);
    logger.success(`Created markdown → ${mdPath}`);
    stats.markdownCreated++;
  }

  await processGallery(eventDir, photos, stats);
}
