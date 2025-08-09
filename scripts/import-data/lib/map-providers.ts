import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Environment variables
const STADIA_API_KEY = process.env.STADIA_MAPS_API_KEY;

// Base attribution that applies to all providers
const BASE_OSM_ATTRIBUTION = "© OpenStreetMap contributors";

// Map provider configurations
// see https://leaflet-extras.github.io/leaflet-providers/preview/
const providers = {
  // OpenStreetMap variants
  openstreetmap: {
    url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "",
  },
  bzh: {
    url: "https://tile.openstreetmap.bzh/ca/{z}/{x}/{y}.png",
    attribution: "",
  },
  osmDE: {
    url: "https://tile.openstreetmap.de/{z}/{x}/{y}.png",
    attribution: "",
  },
  osmFrance: {
    url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
    attribution: "",
  },
  osmHOT: {
    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
    attribution: ", © Humanitarian OpenStreetMap Team",
  },

  // CartoDB/CARTO
  carto: {
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png",
    attribution: ", © CartoDB",
  },
  cartoPositron: {
    url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    attribution: ", © CartoDB",
  },
  cartoDarkMatter: {
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
    attribution: ", © CartoDB",
  },
  cartoPositronNoLabels: {
    url: "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
    attribution: ", © CartoDB",
  },
  cartoDarkMatterNoLabels: {
    url: "https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png",
    attribution: ", © CartoDB",
  },

  // Stadia Maps (formerly Stamen)
  stadiaBright: {
    url: `https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: ", © Stadia Maps",
  },
  stadiaWaterColor: {
    url: `https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.png?api_key=${STADIA_API_KEY}`,
    attribution: ", © Stadia Maps, © Stamen Design",
  },
  stadiaStamenToner: {
    url: `https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: ", © Stadia Maps, © Stamen Design",
  },
  stadiaStamenTonerLite: {
    url: `https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: ", © Stadia Maps, © Stamen Design",
  },
  stadiaStamenTerrain: {
    url: `https://tiles.stadiamaps.com/tiles/stamen_terrain/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: ", © Stadia Maps, © Stamen Design",
  },
  stadiaStamenTerrainBackground: {
    url: `https://tiles.stadiamaps.com/tiles/stamen_terrain_background/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: ", © Stadia Maps, © Stamen Design",
  },
  stadiaOutdoors: {
    url: `https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: ", © Stadia Maps",
  },
  stadiaAlidadeSmoothDark: {
    url: `https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png?api_key=${STADIA_API_KEY}`,
    attribution: ", © Stadia Maps",
  },

  // CyclOSM
  cyclOSM: {
    url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
    attribution: ", © CyclOSM",
  },

  // OpenTopoMap
  openTopoMap: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: ", © OpenTopoMap (CC-BY-SA)",
  },

  // Esri
  esriWorldStreetMap: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: ", © Esri",
  },
  esriWorldImagery: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution:
      ", © Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community",
  },
  esriWorldTopographic: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: ", © Esri",
  },
  esriWorldShadedRelief: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
    attribution: ", © Esri",
  },
  esriWorldPhysical: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}",
    attribution: ", © Esri",
  },
  esriWorldTerrain: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Terrain_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: ", © Esri",
  },
  esriWorldGrayCanvas: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: ", © Esri",
  },

  // NASAGIBS
  nasaModisTerra: {
    url: "https://map1.vis.earthdata.nasa.gov/wmts-geo/1.0.0/MODIS_Terra_CorrectedReflectance_TrueColor/default/{time}/{tilematrixset}{max_zoom}/{z}/{y}/{x}.jpg",
    attribution: ", © NASA Goddard Space Flight Center",
  },
} as const;

export type ProviderKey = keyof typeof providers;

export interface MapProviderConfig {
  url: string;
  attribution: string;
}

/**
 * Get provider configuration with validation and full attribution
 */
export function getMapProviderConfig(providerKey: ProviderKey): MapProviderConfig {
  // Validate provider exists
  if (!(providerKey in providers)) {
    throw new Error(`Unknown map provider: ${providerKey}`);
  }

  // Check if the provider requires API keys
  if (providerKey.toLowerCase().startsWith("stadia")) {
    if (!STADIA_API_KEY) {
      throw new Error(
        `Provider "${providerKey}" requires STADIA_API_KEY environment variable to be set in .env.local`,
      );
    }
  }

  const provider = providers[providerKey];
  return {
    url: provider.url,
    attribution: BASE_OSM_ATTRIBUTION + provider.attribution,
  };
}

// Export available provider keys for type safety
export const availableProviders = Object.keys(providers) as ProviderKey[];
