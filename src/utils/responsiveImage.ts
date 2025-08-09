// responsive-images.ts
import type { ImageMetadata } from "astro";

export async function safeGetImage(options: any): Promise<{ src: string }> {
  try {
    // Try to dynamically import getImage
    const { getImage } = await import("astro:assets");
    return await getImage(options);
  } catch (error) {
    // In test environment or when getImage is not available,
    // return the original src
    return { src: options.src?.src || options.src || "" };
  }
}
// Default breakpoints as fallback
export const OUTPUT_SIZES = [420, 720, 1200] as const;

// Tailwind CSS breakpoint values
const BP = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

const imageCache = new Map<string, ResponsiveImageData>();

export interface ResponsiveImageData {
  src: string;
  srcSet: string;
  sizes: string;
}

export type ImageType =
  | "sidebarLayoutHero"
  | "eventPolaroid"
  | "eventCompact"
  | "galleryThumbnail"
  | "galleryLightbox"
  | "blobSlideshow"
  | "venueMap";

interface ImageConfig {
  sizes: string;
  cropAspectRatio?: number; // Optional aspect ratio (width/height)
  breakpoints?: readonly number[]; // Optional custom breakpoints for this image type
}

export const IMAGE_CONFIGS: Record<ImageType, ImageConfig> = {
  sidebarLayoutHero: {
    sizes: `(max-width: ${BP.md}px) 100vw, 70vw`,
    // 100vw on mobile, 70vw on desktop
  },
  eventPolaroid: {
    sizes: [
      `(max-width: ${BP.sm}px) 100vw`,
      `(max-width: ${BP.lg}px) 50vw`,
      `(min-width: ${BP.lg + 1}px) 20vw`,
      "100vw",
    ].join(", "),
    // 100vw mobile, 50vw tablet, 20vw desktop
  },
  eventCompact: {
    sizes: "200px", // Fixed width
  },
  galleryThumbnail: {
    sizes: [
      `(max-width: ${BP.sm}px) 100vw`,
      `(max-width: ${BP.lg}px) 50vw`,
      `(min-width: ${BP.lg + 1}px) 25vw`,
      "100vw",
    ].join(", "),
    cropAspectRatio: 4 / 3,
    // Same as eventPolaroid
  },
  galleryLightbox: {
    // Full viewport at key breakpoints
    sizes: "100vw",
  },
  blobSlideshow: {
    sizes: `(max-width: ${BP.md}px) 100vw, 50vw`,
    cropAspectRatio: 4 / 3,
  },
  venueMap: {
    sizes: `(min-width: ${BP.sm}px) 33vw, 100vw`,
  },
};

/**
 * Creates a cache key based on image metadata and image type
 */
function createCacheKey(image: ImageMetadata, imageType: ImageType): string {
  // Use the image source path and image type to create a unique key
  const imagePath = (image as any).src || String(image);
  return `${imagePath}:${imageType}`;
}

/*
srcset="
/_astro/PXL_20250719_0946379792.Dotqtig7_ZoBrEI.webp 420w, 
/_astro/PXL_20250719_0946379792.Dotqtig7_1RxIhl.webp 720w, 
/_astro/PXL_20250719_0946379792.Dotqtig7_2jEGBn.webp 1200w"


/**
 * Generate responsive image data for an Astro ImageMetadata input and an image type.
 *
 * - Uses BREAKPOINTS, capped to the original image width
 * - Produces WebP variants at quality 80
 * - Applies cropping if specified in the image config
 * - Returns { src, srcSet, sizes } ready to spread onto <img>
 */
export async function generateResponsiveImage(
  image: ImageMetadata,
  imageType: ImageType = "galleryLightbox",
): Promise<ResponsiveImageData> {
  // Check cache first
  const cacheKey = createCacheKey(image, imageType);
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  // Get the config for this image type
  const config = IMAGE_CONFIGS[imageType];
  const { sizes, cropAspectRatio } = config;

  // Only use breakpoints smaller than or equal to original image width
  const widths = OUTPUT_SIZES.filter((w) => w <= image.width);

  // If no valid widths, use the original width
  const candidateWidths = widths.length > 0 ? widths : [image.width];

  // Generate all variants
  const variants = await Promise.all(
    candidateWidths.map(async (width) => {
      const imageOptions: any = {
        src: image,
        width,
        format: "webp",
        quality: 80,
      };

      // Apply cropping if aspect ratio is specified
      if (cropAspectRatio) {
        imageOptions.height = Math.round(width / cropAspectRatio);
        imageOptions.fit = "cover";
      }

      // reutrn nul lfor debugging
      const optimized = await safeGetImage(imageOptions);
      return { url: optimized.src, width };
    }),
  );

  // Largest variant (last in array) → sensible fallback `src`
  const largest = variants[variants.length - 1];

  const result: ResponsiveImageData = {
    src: largest.url, // URL only (not "url 1200w")
    srcSet: variants.map((v) => `${v.url} ${v.width}w`).join(", "),
    sizes,
  };

  // Cache the result
  imageCache.set(cacheKey, result);

  return result;
}
