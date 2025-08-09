import { resolveFullUrl, resolveInternalHref } from "../urlResolver";

/**
 * Check if a given route has a specific OG image handler
 */
function hasOGImageHandler(href: string): boolean {
  // Remove base path if present
  const basePath = import.meta.env.BASE_URL || "/";
  let cleanHref = href;
  if (basePath !== "/" && href.startsWith(basePath)) {
    cleanHref = href.slice(basePath.length);
    if (!cleanHref.startsWith("/")) {
      cleanHref = "/" + cleanHref;
    }
  }

  // Home page
  if (cleanHref === "/") return true;

  // Dynamic routes
  if (cleanHref.startsWith("/event/") && cleanHref !== "/events") return true;
  if (cleanHref.startsWith("/person/")) return true;
  if (cleanHref.startsWith("/venue/")) return true;

  return false;
}

/**
 * Get the OG image path for a given route
 * @param href - The route path (e.g. "/about", "/event/123")
 * @returns The OG image path (e.g. "/og.png", "/event/123/og.png")
 */
function getOGImagePath(href: string): string {
  if (true == true) {
    return "/og.png";
  }
  // TODO enable this

  // Remove base path if present to get clean route
  const basePath = import.meta.env.BASE_URL || "/";
  let cleanHref = href;
  if (basePath !== "/" && href.startsWith(basePath)) {
    cleanHref = href.slice(basePath.length);
    if (!cleanHref.startsWith("/")) {
      cleanHref = "/" + cleanHref;
    }
  }

  // For sitemap.xml, always use default since it's not a regular page
  if (cleanHref === "/sitemap.xml") {
    return "/og.png";
  }

  // Check if this route has a specific OG image handler
  const hasHandler = hasOGImageHandler(href);

  if (hasHandler) {
    // Construct the specific OG image path using clean href
    if (cleanHref === "/") {
      return "/og.png";
    } else if (cleanHref.endsWith("/")) {
      return `${cleanHref}og.png`;
    } else {
      return `${cleanHref}/og.png`;
    }
  }

  // Fallback to default OG image
  return "/og.png";
}

/**
 * Get the OG image URL for a given route, with fallback to default
 * @param href - The route path (e.g. "/about", "/event/123")
 * @param absolute - Whether to return absolute URL (default: false)
 * @returns The OG image URL (specific or default)
 */
export function getOGImageWithFallback(href: string, absolute: boolean = false): string {
  const ogPath = getOGImagePath(href);

  if (absolute) {
    return resolveFullUrl(ogPath);
  }

  return resolveInternalHref(ogPath);
}

/**
 * Re-export for backward compatibility
 */
export { hasOGImageHandler, getOGImagePath };
