#!/usr/bin/env npx tsx
/**
 * Generate redirects.json file from content/events directory
 *
 * Run this script after adding new events to generate updated redirects
 * for migrating from old owddm.com URL format (/events/[id]) to new format (/event/[slug])
 *
 * Usage: npm run generate-redirects (add this to package.json scripts)
 *        or: npx tsx scripts/generate-redirects.tsx
 */
import { readdirSync, writeFileSync } from "fs";
import { resolve } from "path";

// Type for the redirect structure
interface Redirects {
  [oldPath: string]: string;
}

async function generateRedirects() {
  try {
    // Path to events content directory
    const eventsDir = resolve(process.cwd(), "content/events");

    // Get all event directories
    const eventDirs = readdirSync(eventsDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name)
      .filter((name) => !name.startsWith(".")); // Skip hidden directories

    // Start with static redirects
    const redirects: Redirects = {
      // Discord invite link
      discord: "https://discord.com/invite/k8xj8d75f6",

      // Static page redirects
      "/photos": "/events/album",
      "/join": "/about",
      "/coc": "/code-of-conduct",
    };

    // Add all event redirects
    // Event directory names are in format: "123456789-event-slug"
    eventDirs.forEach((eventDir) => {
      const eventId = eventDir.split("-")[0]; // Get just the numeric ID
      if (eventId && /^\d+$/.test(eventId)) {
        // Ensure it's numeric
        redirects[`/events/${eventId}`] = `/event/${eventDir}`;
      }
    });

    // Sort the redirects for better readability
    const sortedRedirects: Redirects = {};

    // First add non-event redirects
    Object.entries(redirects)
      .filter(([key]) => !key.startsWith("/events/"))
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([key, value]) => {
        sortedRedirects[key] = value;
      });

    // Then add event redirects sorted by ID
    Object.entries(redirects)
      .filter(([key]) => key.startsWith("/events/"))
      .sort(([a], [b]) => {
        const idA = parseInt(a.replace("/events/", ""));
        const idB = parseInt(b.replace("/events/", ""));
        return idB - idA; // Sort descending (newest first)
      })
      .forEach(([key, value]) => {
        sortedRedirects[key] = value;
      });

    // Write to redirects.json
    const outputPath = resolve(process.cwd(), "redirects.json");
    writeFileSync(outputPath, JSON.stringify(sortedRedirects, null, 2));

    const eventRedirectCount = Object.keys(redirects).filter((k) =>
      k.startsWith("/events/"),
    ).length;

    console.log(`✅ Generated redirects.json with ${Object.keys(redirects).length} redirects`);
    console.log(`   - 1 external redirect (discord)`);
    console.log(`   - 3 static page redirects`);
    console.log(`   - ${eventRedirectCount} event redirects`);
    console.log(`📁 Output: ${outputPath}`);
  } catch (error) {
    console.error("❌ Error generating redirects:", error);
    process.exit(1);
  }
}

// Run the script
generateRedirects();
