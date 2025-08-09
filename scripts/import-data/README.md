# Import Data Script

This CLI tool imports event and venue data from external JSON sources and processes them into the local content structure for the OKTech website. It also provides utilities for clearing generated data.

## Project Structure

```
import-data/
├── index.ts           # Main CLI controller - handles commands and orchestration
├── README.md          # This documentation
└── lib/
    ├── clear.ts       # Data clearing utilities
    ├── constants.ts   # Configuration constants
    ├── events.ts      # Event processing logic
    ├── logger.ts      # Logging utilities
    ├── map-providers.ts # Map provider configurations
    ├── maps.ts        # Map generation utilities
    ├── photos.ts      # Photo processing and redistribution logic
    ├── statistics.ts  # Statistics tracking and reporting
    ├── types.ts       # TypeScript type definitions
    ├── utils.ts       # Common utility functions
    ├── venues.ts      # Venue processing logic
    └── yaml-engine.ts # YAML processing utilities
```

## Overview

The import script (`npm run import`) fetches data from external URLs and creates/updates local event and venue files with associated metadata and images.

## Data Sources

The script fetches data from two external URLs (defined in `constants.ts`):

- **Events and Venues**: `https://owddm.com/public/events_w_venues.json`
- **Photos**: `https://owddm.com/public/photos.json`

## Key Features

### 1. Event Processing

- Creates event directories under `/content/events/` with slugified names
- Generates `event.md` files with frontmatter containing event metadata
- Downloads and saves venue maps when `overwriteMaps` is true
- Processes photo galleries for each event

### 2. Photo Assignment and Distribution

The script assigns photos to events using multiple strategies:

#### Explicit Assignment

Photos with an explicit `event` field in the JSON are directly assigned to that event.

#### Timestamp-based Inference

When `INFER_EVENTS` is enabled (default: true):

- Photos without explicit event IDs are assigned to the event whose start time is closest _before_ the photo timestamp
- This assumes photos are typically uploaded after the event they document

#### Photo Batch Redistribution

When multiple photo batches are assigned to the same event:

1. The script identifies events with multiple batches and events without any photos
2. It redistributes ONLY if there are empty events available to receive the batches
3. It keeps the latest batch(es) with the original event and redistributes earlier ones
4. If there are more batches than empty events, the extra batches stay with the original event
5. Redistribution maintains chronological order - only assigns to events that occurred before the original event

Example scenarios:

```
Scenario 1 - Full redistribution:
Event A (July 20): 2 photo batches, 1 empty event nearby → keeps batch 2, redistributes batch 1
Event B (July 19): 0 photo batches → receives batch 1

Scenario 2 - Partial redistribution:
Event A (July 20): 3 photo batches, 1 empty event nearby → keeps batches 2-3, redistributes batch 1
Event B (July 19): 0 photo batches → receives batch 1

Scenario 3 - No redistribution:
Event A (July 20): 2 photo batches, 0 empty events nearby → keeps all batches
```

This ensures that photos are never deleted and events can maintain multiple batches when there aren't enough empty events to redistribute to.

### 3. Gallery Management

#### Photo Download

- Downloads images from remote URLs to local gallery directories
- Preserves original filenames
- Creates YAML metadata files for photos with captions

#### Cleanup Process

The script maintains clean gallery directories by:

- Removing photos that are no longer assigned to an event
- Deleting associated `.yaml` metadata files for removed photos
- Removing empty gallery directories
- Logging all deletions as warnings

This ensures that if photos are reassigned between events (either manually or through redistribution), the old locations are properly cleaned up.

### 4. Venue Processing

- Creates venue directories under `/content/venues/`
- Generates `venue.md` files with venue metadata
- Downloads and caches venue maps (when enabled)

## Statistics Tracking

The script tracks comprehensive statistics during import:

- **Events**: Total, created, updated, unchanged
- **Venues**: Total, created, updated, unchanged
- **Photo Batches**: Total, assigned, unassigned
- **Gallery Images**: Downloaded, unchanged, deleted
- **Metadata**: Created, unchanged, not applicable
- **Maps**: Generated, unchanged, failed

The statistics are displayed in a structured format at the end of the import, with warnings for any unassigned photo batches.

## Configuration

Key constants in `constants.ts`:

- `INFER_EVENTS`: Enable timestamp-based photo assignment (default: true)
- `EVENTS_URL`: Source URL for events data
- `PHOTOS_URL`: Source URL for photos data
- `EVENTS_BASE_DIR`: Local directory for event content
- `VENUES_BASE_DIR`: Local directory for venue content

## Usage

### Import Commands

```bash
# Run the import with default settings
npm run import

# Import with map regeneration (overwrites existing maps)
npm run import -- --overwrite-maps

# Show help
npm run import -- --help
```

### Clear Commands

```bash
# Clear specific data types
npm run import -- clear markdown        # Clear all markdown files (events and venues)
npm run import -- clear events          # Clear event markdown files
npm run import -- clear venues          # Clear venue markdown files
npm run import -- clear image-files     # Clear image files
npm run import -- clear image-metadata  # Clear image metadata files
npm run import -- clear images          # Clear images (files and metadata)
npm run import -- clear maps            # Clear venue map files
npm run import -- clear empty-dirs      # Clear empty directories
npm run import -- clear all             # Clear all data
```

### Remove Fields Commands

```bash
# Remove fields from content files
npm run import -- remove-fields venues                      # Remove default venue fields
npm run import -- remove-fields venues --fields city,state  # Remove specific venue fields
npm run import -- remove-fields events --fields meetupId    # Remove meetupId from events
npm run import -- remove-fields people --fields skills      # Remove skills from people

# Default fields that are removed:
# - venues: country, postalCode, crossStreet
# - events: none
# - people: none
```

## Error Handling

- Failed image downloads are logged but don't stop the import
- The script continues processing even if individual operations fail
- Unmatched cities (not found in cityMap) are reported at the end
- Photos that can't be assigned to any event are logged as warnings

## Important Notes

1. **Idempotent Operation**: Running the script multiple times is safe. It will:
   - Skip downloading images that already exist
   - Update metadata only when changed
   - Clean up stale files automatically

2. **Photo Reassignment**: When photos are reassigned (manually or through redistribution):
   - Old gallery locations are automatically cleaned
   - Empty directories are removed
   - All changes are logged

3. **Manual Photo Management**: Photos manually placed in gallery folders will be preserved unless they conflict with imported photos. However, if the import assigns different photos to that event, manual photos may be removed during cleanup.
