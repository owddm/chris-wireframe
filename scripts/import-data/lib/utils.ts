import { existsSync } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

import { MAX_IMAGE_WIDTH } from "../../../src/constants";
import { GITHUB_API_BASE, GITHUB_RAW_BASE } from "./constants";
import { githubFetch, githubFetchJSON } from "./github-fetch";
import { logger } from "./logger";
import type { ImportStatistics } from "./statistics";

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

    const response = await githubFetch(fullUrl);

    if (!response.ok) {
      throw new Error(`Failed to download: ${response.status} ${response.statusText}`);
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer());

    // Ensure directory exists
    await fs.mkdir(path.dirname(localPath), { recursive: true });

    // Process image with Sharp:
    // 1. Auto-rotate based on EXIF orientation
    // 2. Resize if width exceeds MAX_IMAGE_WIDTH
    // 3. Convert to WebP format for better compression
    const processedBuffer = await sharp(imageBuffer)
      // TODO we should fix the exif metadata.
      // the autoOrient is causing images to be mis-rotate.
      // .autoOrient() // Automatically rotate based on EXIF orientation <- this is screwing thing up.
      .resize(MAX_IMAGE_WIDTH, null, {
        withoutEnlargement: true, // Don't upscale smaller images
        fit: "inside", // Preserve aspect ratio
      })
      .webp({ quality: 85 }) // Convert to WebP with good quality
      .toBuffer();

    // Write processed image to disk
    await fs.writeFile(localPath, processedBuffer);
    return true; // Image was downloaded and processed
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
