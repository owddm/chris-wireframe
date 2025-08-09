import matter from "gray-matter";
import fs from "node:fs/promises";
import { glob } from "node:fs/promises";
import path from "node:path";

import { logger } from "./logger";

// Base directories for different content types
const CONTENT_DIRS = {
  venues: "./content/venues",
  events: "./content/events",
};

// Default fields to remove for each content type
const DEFAULT_FIELDS = {
  venues: ["country", "postalCode", "crossStreet"],
  events: [], // Add default fields for events if needed
};

// File patterns for each content type
const FILE_PATTERNS = {
  venues: "**/venue.md",
  events: "**/event.md",
};

type ContentType = keyof typeof CONTENT_DIRS;

async function removeFields(contentType: ContentType, fieldsToRemove: string[]): Promise<void> {
  const baseDir = CONTENT_DIRS[contentType];
  const filePattern = FILE_PATTERNS[contentType];

  logger.section(`Removing fields from ${contentType}`);
  logger.info(`Fields to remove: ${fieldsToRemove.join(", ")}`);

  let filesProcessed = 0;
  let filesModified = 0;

  // Find all matching files
  const files = glob(filePattern, { cwd: baseDir });

  for await (const file of files) {
    const filePath = path.join(baseDir, file);
    filesProcessed++;

    try {
      // Read the file
      const content = await fs.readFile(filePath, "utf-8");
      const parsed = matter(content);

      // Track which fields were removed
      const removedFields: string[] = [];

      // Check and remove specified fields
      for (const field of fieldsToRemove) {
        if (field in parsed.data) {
          delete parsed.data[field];
          removedFields.push(field);
        }
      }

      if (removedFields.length > 0) {
        // Write back the file
        const newContent = matter.stringify(parsed.content, parsed.data);
        await fs.writeFile(filePath, newContent);

        filesModified++;
        logger.success(`Updated: ${file}`);
        removedFields.forEach((field) => {
          logger.info(`  - Removed ${field} field`);
        });
      }
    } catch (error) {
      logger.error(`Error processing ${file}:`, error);
    }
  }

  logger.separator();
  logger.info("Summary:");
  logger.info(`- Files processed: ${filesProcessed}`);
  logger.info(`- Files modified: ${filesModified}`);
  logger.info(`- Files unchanged: ${filesProcessed - filesModified}`);
}

export async function handleRemoveFields(args: string[]) {
  // Remove the 'remove-fields' command from args
  const commandArgs = args.slice(1);

  if (commandArgs.length === 0 || commandArgs.includes("--help")) {
    showRemoveFieldsHelp();
    process.exit(0);
  }

  const contentType = commandArgs[0] as ContentType;

  // Validate content type
  if (!CONTENT_DIRS[contentType]) {
    logger.error(`Invalid content type: ${contentType}`);
    logger.info("Valid types are: venues, events");
    process.exit(1);
  }

  // Parse fields to remove
  let fieldsToRemove = DEFAULT_FIELDS[contentType] || [];

  for (let i = 1; i < commandArgs.length; i++) {
    if (commandArgs[i] === "--fields" && commandArgs[i + 1]) {
      fieldsToRemove = commandArgs[i + 1].split(",").map((field) => field.trim());
      break;
    }
  }

  // Check if fields were provided without --fields flag
  if (commandArgs[1] && !commandArgs[1].startsWith("--")) {
    fieldsToRemove = commandArgs[1].split(",").map((field) => field.trim());
  }

  if (fieldsToRemove.length === 0) {
    logger.warn("No fields specified to remove.");
    logger.info("Use --fields option or provide fields as second argument.");
    process.exit(0);
  }

  try {
    await removeFields(contentType, fieldsToRemove);
  } catch (error) {
    logger.error("Remove fields failed:", error);
    process.exit(1);
  }
}

export function showRemoveFieldsHelp(): void {
  logger.info("Remove Fields:");
  logger.info("  npm run import -- remove-fields <content-type> [options]");
  logger.info("");
  logger.info("Content Types:");
  logger.info("  venues    Remove fields from venue files");
  logger.info("  events    Remove fields from event files");
  logger.info("");
  logger.info("Options:");
  logger.info("  --fields <field1,field2,...>  Comma-separated list of fields to remove");
  logger.info("");
  logger.info("Examples:");
  logger.info(
    "  npm run import -- remove-fields venues                      # Remove default venue fields",
  );
  logger.info(
    "  npm run import -- remove-fields venues --fields city,state  # Remove specific venue fields",
  );
  logger.info(
    "  npm run import -- remove-fields events --fields meetupId    # Remove meetupId from events",
  );
  logger.info("");
  logger.info("Default fields:");
  logger.info(`  - venues: ${DEFAULT_FIELDS.venues.join(", ") || "none"}`);
  logger.info(`  - events: ${DEFAULT_FIELDS.events.join(", ") || "none"}`);
}
