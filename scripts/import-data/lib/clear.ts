import { existsSync } from "node:fs";
import { glob, readdir, rm, rmdir } from "node:fs/promises";
import path from "node:path";

import { EVENTS_BASE_DIR, VENUES_BASE_DIR } from "./constants";
import { logger } from "./logger";

async function removeEmptyDirectories(dir: string): Promise<void> {
  if (!existsSync(dir)) return;

  try {
    const entries = await readdir(dir, { withFileTypes: true });

    // Recursively process subdirectories first
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const fullPath = path.join(dir, entry.name);
        await removeEmptyDirectories(fullPath);
      }
    }

    // Check if directory is now empty and remove it
    const remainingEntries = await readdir(dir);
    if (remainingEntries.length === 0) {
      await rmdir(dir);
      logger.info(`Removed empty directory → ${dir}`);
    }
  } catch (error) {
    // Silently ignore errors (directory might not exist or permission issues)
  }
}

export async function clearMarkdown() {
  const eventsFiles = glob("**/*.md", { cwd: EVENTS_BASE_DIR });
  for await (const file of eventsFiles) {
    await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
  }

  const venuesFiles = glob("**/*.md", { cwd: VENUES_BASE_DIR });
  for await (const file of venuesFiles) {
    await rm(path.join(VENUES_BASE_DIR, file), { force: true });
  }

  // Remove empty directories
  await removeEmptyDirectories(EVENTS_BASE_DIR);
  await removeEmptyDirectories(VENUES_BASE_DIR);
}

export async function clearEventMarkdown() {
  const files = glob("**/*.md", { cwd: EVENTS_BASE_DIR });
  for await (const file of files) {
    await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
  }

  // Remove empty directories
  await removeEmptyDirectories(EVENTS_BASE_DIR);
}

export async function clearVenueMarkdown() {
  const files = glob("**/*.md", { cwd: VENUES_BASE_DIR });
  for await (const file of files) {
    await rm(path.join(VENUES_BASE_DIR, file), { force: true });
  }

  // Remove empty directories
  await removeEmptyDirectories(VENUES_BASE_DIR);
}

export async function clearImageFiles() {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const patterns = imageExtensions.map((ext) => `**/*.${ext}`);
  for (const pattern of patterns) {
    const files = glob(pattern, { cwd: EVENTS_BASE_DIR });
    for await (const file of files) {
      await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
    }
  }
}

export async function clearImageMetadat() {
  const files = glob("**/*.json", { cwd: EVENTS_BASE_DIR });
  for await (const file of files) {
    await rm(path.join(EVENTS_BASE_DIR, file), { force: true });
  }
}

export async function clearMaps() {
  const mapFiles = glob("**/map.jpg", { cwd: VENUES_BASE_DIR });
  let mapsCleared = 0;
  for await (const file of mapFiles) {
    await rm(path.join(VENUES_BASE_DIR, file), { force: true });
    mapsCleared++;
  }
  logger.success(`Cleared ${mapsCleared} map files.`);
}

export async function clearImages() {
  await clearImageFiles();
  await clearImageMetadat();

  // Remove empty directories
  await removeEmptyDirectories(EVENTS_BASE_DIR);
}

export async function clearAll() {
  await clearMarkdown();
  await clearImages();

  // Final cleanup of any remaining empty directories
  await removeEmptyDirectories(EVENTS_BASE_DIR);
  await removeEmptyDirectories(VENUES_BASE_DIR);
}

export async function clearEmptyDirectories() {
  await removeEmptyDirectories(EVENTS_BASE_DIR);
  await removeEmptyDirectories(VENUES_BASE_DIR);
}

export async function handleClear(clearType: string) {
  switch (clearType) {
    case "markdown":
      logger.info("Clearing all markdown files...");
      await clearMarkdown();
      logger.success("All markdown files cleared.");
      break;
    case "events":
      logger.info("Clearing event markdown files...");
      await clearEventMarkdown();
      logger.success("Event markdown files cleared.");
      break;
    case "venues":
      logger.info("Clearing venue markdown files...");
      await clearVenueMarkdown();
      logger.success("Venue markdown files cleared.");
      break;
    case "image-files":
      logger.info("Clearing image files...");
      await clearImageFiles();
      logger.success("Image files cleared.");
      break;
    case "image-metadata":
      logger.info("Clearing image metadata files...");
      await clearImageMetadat();
      logger.success("Image metadata files cleared.");
      break;
    case "images":
      logger.info("Clearing images (files and metadata)...");
      await clearImages();
      logger.success("Images cleared.");
      break;
    case "maps":
      logger.info("Clearing venue map files...");
      await clearMaps();
      logger.success("Venue map files cleared.");
      break;
    case "all":
      logger.info("Clearing all data...");
      await clearAll();
      logger.success("All data cleared.");
      break;
    case "empty-dirs":
      logger.info("Clearing empty directories...");
      await clearEmptyDirectories();
      logger.success("Empty directories cleared.");
      break;
    default:
      logger.error(`Unknown clear type: ${clearType}`);
      logger.error("");
      logger.error(
        "Valid clear types: markdown, events, venues, image-files, image-metadata, images, maps, empty-dirs, all",
      );
      process.exit(1);
  }
}
