import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

interface EventData {
  id: string;
  data: {
    title: string;
    dateTime: string;
    topics?: string[];
  };
  venue?: {
    id: string;
    title: string;
    city?: string;
  };
}

interface PersonData {
  id: string;
  name?: string;
  bio?: string;
  title?: string;
  data?: {
    name?: string;
    bio?: string;
    title?: string;
  };
}

interface VenueData {
  id: string;
  name?: string;
  description?: string;
  city?: string;
  data?: {
    name?: string;
    description?: string;
    city?: string;
  };
}

export interface CacheableContent {
  event?: EventData;
  person?: PersonData;
  venue?: VenueData;
  mapImageBase64?: string | null;
  coverImageBase64?: string | null;
}

export class OGImageCache {
  private cacheDir: string;

  constructor() {
    // Use the same cache directory as Astro for consistency
    this.cacheDir = path.join(process.cwd(), ".cache", "og-images");
  }

  /**
   * Generate a cache key based on the content that affects the OG image
   */
  private generateCacheKey(content: CacheableContent): string {
    const hashContent: Record<string, unknown> = {};

    // Handle event data
    if (content.event) {
      hashContent.eventId = content.event.id;
      hashContent.title = content.event.data.title;
      hashContent.dateTime = content.event.data.dateTime;
      hashContent.topics = content.event.data.topics;
      hashContent.venueId = content.event.venue?.id;
      hashContent.venueTitle = content.event.venue?.title;
      hashContent.venueCity = content.event.venue?.city;
    }

    // Handle person data
    if (content.person) {
      hashContent.personId = content.person.id;
      // Handle both person.data.name and person.name structures
      hashContent.personName = content.person.data?.name || content.person.name;
      hashContent.personBio = content.person.data?.bio || content.person.bio;
      hashContent.personTitle = content.person.data?.title || content.person.title;
    }

    // Handle venue data
    if (content.venue) {
      hashContent.venueId = content.venue.id;
      // Handle both venue.data.name and venue.name structures
      hashContent.venueName = content.venue.data?.name || content.venue.name;
      hashContent.venueDescription = content.venue.data?.description || content.venue.description;
      hashContent.venueCity = content.venue.data?.city || content.venue.city;
    }

    // Handle images
    hashContent.hasMapImage = !!content.mapImageBase64;
    hashContent.hasCoverImage = !!content.coverImageBase64;

    // Hash the actual image content if present
    if (content.mapImageBase64) {
      hashContent.mapImageHash = crypto
        .createHash("md5")
        .update(content.mapImageBase64)
        .digest("hex")
        .substring(0, 8);
    }

    if (content.coverImageBase64) {
      hashContent.coverImageHash = crypto
        .createHash("md5")
        .update(content.coverImageBase64)
        .digest("hex")
        .substring(0, 8);
    }

    return crypto
      .createHash("sha256")
      .update(JSON.stringify(hashContent))
      .digest("hex")
      .substring(0, 16);
  }

  /**
   * Get the cache file path for a given cache key
   */
  private getCacheFilePath(cacheKey: string): string {
    return path.join(this.cacheDir, `${cacheKey}.png`);
  }

  /**
   * Check if a cached version exists and is still valid
   */
  async isCached(content: CacheableContent): Promise<boolean> {
    try {
      const cacheKey = this.generateCacheKey(content);
      const cachePath = this.getCacheFilePath(cacheKey);

      await fs.access(cachePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get cached image buffer if it exists
   */
  async getCachedImage(content: CacheableContent): Promise<Buffer | null> {
    try {
      const cacheKey = this.generateCacheKey(content);
      const cachePath = this.getCacheFilePath(cacheKey);

      return await fs.readFile(cachePath);
    } catch {
      return null;
    }
  }

  /**
   * Cache a generated image buffer
   */
  async cacheImage(content: CacheableContent, imageBuffer: Buffer): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(content);
      const cachePath = this.getCacheFilePath(cacheKey);

      // Ensure cache directory exists
      await fs.mkdir(this.cacheDir, { recursive: true });

      // Write the image to cache
      await fs.writeFile(cachePath, imageBuffer);
    } catch (error) {
      console.error("Failed to cache OG image:", error);
    }
  }

  /**
   * Clear all cached images (useful for cache invalidation)
   */
  async clearCache(): Promise<void> {
    try {
      const files = await fs.readdir(this.cacheDir);
      const deletedFiles = await Promise.all(
        files
          .filter((file) => file.endsWith(".png"))
          .map((file) => fs.unlink(path.join(this.cacheDir, file)).then(() => file)),
      );
      console.log(`Cleared ${deletedFiles.length} cached OG images`);
    } catch (error) {
      // Cache directory might not exist yet
      if (
        error instanceof Error &&
        "code" in error &&
        (error as NodeJS.ErrnoException).code === "ENOENT"
      ) {
        console.log("OG cache directory does not exist yet");
      } else {
        console.error("Failed to clear OG image cache:", error);
      }
    }
  }

  /**
   * Get cache statistics
   */
  async getCacheStats(): Promise<{ count: number; totalSize: number }> {
    try {
      const files = await fs.readdir(this.cacheDir);
      const pngFiles = files.filter((file) => file.endsWith(".png"));

      let totalSize = 0;
      for (const file of pngFiles) {
        const filePath = path.join(this.cacheDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;
      }

      return {
        count: pngFiles.length,
        totalSize,
      };
    } catch {
      return { count: 0, totalSize: 0 };
    }
  }
}
