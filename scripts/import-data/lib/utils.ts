import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";

import { GITHUB_API_BASE, GITHUB_RAW_BASE } from "./constants";
import { githubFetch, githubFetchJSON } from "./github-fetch";
import { logger } from "./logger";
import type { ImportStatistics } from "./statistics";

const IMAGE_CACHE = new Map<string, Buffer>();

export async function downloadImage(url: string, localPath: string): Promise<boolean> {
  const fullUrl = url.startsWith("http") ? url : `${GITHUB_RAW_BASE}${url}`;

  try {
    // Check if image already exists locally
    if (existsSync(localPath)) {
      const stats = await fs.stat(localPath);
      if (stats.size > 0) {
        // Valid image already exists
        return false; // Image was unchanged
      }
    }

    // Check memory cache first
    let imageBuffer = IMAGE_CACHE.get(fullUrl);

    if (!imageBuffer) {
      // Download image using centralized GitHub fetch
      const response = await githubFetch(fullUrl);
      if (!response.ok) {
        throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
      }
      imageBuffer = Buffer.from(await response.arrayBuffer());

      // Cache for future use in this run
      IMAGE_CACHE.set(fullUrl, imageBuffer);
    }

    // Ensure directory exists
    await fs.mkdir(path.dirname(localPath), { recursive: true });

    // Write image to disk
    await fs.writeFile(localPath, imageBuffer);
    return true; // Image was downloaded
  } catch (err) {
    // Don't log here - let the caller handle logging
    throw err;
  }
}

export function calculateImageStats(
  existingCount: number,
  downloadedCount: number,
  stats: ImportStatistics,
): void {
  if (existingCount > 0) {
    stats.galleryImagesUnchanged += existingCount;
  }
  if (downloadedCount > 0) {
    stats.galleryImagesDownloaded += downloadedCount;
  }
}

export async function fetchLatestCommitInfo(): Promise<{ sha: string; date: string }> {
  try {
    const data = await githubFetchJSON(`${GITHUB_API_BASE}/commits/main`);
    return {
      sha: data.sha,
      date: data.commit.committer.date,
    };
  } catch (err) {
    logger.error("Failed to fetch latest commit info:", err);
    throw err;
  }
}
