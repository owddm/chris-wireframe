import fs from "node:fs/promises";
import path from "node:path";
// @ts-ignore
import osmStaticMaps from "osm-static-maps";

import { logger } from "./logger";
import { type ProviderKey, getMapProviderConfig } from "./map-providers";

// Set the chosen provider here
// Free providers: "openstreetmap", "carto", "cartoPositron", "cartoDarkMatter"
// Paid providers (require API key): "stadiaWaterColor", "stadiaBright", etc.
const CHOSEN_PROVIDER: ProviderKey = "stadiaWaterColor";
const DARK_MODE_PROVIDER: ProviderKey = "stadiaAlidadeSmoothDark";

export interface MapOptions {
  lat: number;
  lng: number;
  width?: number;
  height?: number;
  zoom?: number;
}

export async function generateStaticMap(
  outputPath: string,
  options: MapOptions,
  isDarkMode = false,
): Promise<boolean> {
  const { lat, lng, width = 1024, height = 1024, zoom = 15 } = options;

  try {
    // Get provider configuration with validation
    const provider = getMapProviderConfig(isDarkMode ? DARK_MODE_PROVIDER : CHOSEN_PROVIDER);

    // Create map options for osm-static-maps
    const mapOptions = {
      // No geojson to avoid any default markers
      center: `${lng},${lat}`,
      zoom,
      width,
      height,
      tileserverUrl: provider.url,
      attribution: provider.attribution,
      type: "jpeg" as const,
      quality: 90,
      // Marker removed - will be added in DOM with Lucide icon
    };

    // Generate the map
    const imageBuffer = await osmStaticMaps(mapOptions);

    // Ensure directory exists
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    // Write the image
    await fs.writeFile(outputPath, imageBuffer);

    logger.success(`Generated ${isDarkMode ? "dark mode" : "light mode"} map → ${outputPath}`);
    return true;
  } catch (error) {
    // Provide more detailed error messages
    const errorMessage = error instanceof Error ? error.message : String(error);

    if (errorMessage.includes("STADIA_API_KEY")) {
      logger.error(
        `Map generation failed - Missing API key for provider "${CHOSEN_PROVIDER}". Set STADIA_MAPS_API_KEY in .env.local`,
      );
    } else if (errorMessage.includes("ECONNREFUSED") || errorMessage.includes("ETIMEDOUT")) {
      logger.error(`Map generation failed - Could not connect to tile server: ${errorMessage}`);
    } else if (errorMessage.includes("status code")) {
      logger.error(`Map generation failed - Tile server error: ${errorMessage}`);
    } else {
      logger.error(`Map generation failed for ${outputPath}: ${errorMessage}`);
    }

    return false;
  }
}
