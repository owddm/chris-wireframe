import { logger } from "./logger";

/**
 * Centralized fetch utility for GitHub API and raw content requests.
 * Automatically uses GitHub token when available (in GitHub Actions).
 */
export async function githubFetch(url: string, options?: RequestInit): Promise<Response> {
  // Build headers for GitHub request (use Record for proper typing)
  const headers: Record<string, string> = {
    "User-Agent": "oktech-web-import-script",
  };

  // Merge existing headers if provided
  if (options?.headers) {
    const existingHeaders = new Headers(options.headers);
    existingHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  // Use GitHub token if available (in GitHub Actions)
  // Works for both api.github.com and raw.githubusercontent.com
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `token ${process.env.GITHUB_TOKEN}`;

    // Log only for API calls, not raw content (to avoid spam)
    if (url.includes("api.github.com")) {
      logger.info("Using GitHub token for API request");
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
}

/**
 * Fetch JSON data from GitHub with automatic authentication
 */
export async function githubFetchJSON<T = any>(url: string, options?: RequestInit): Promise<T> {
  const response = await githubFetch(url, options);

  if (!response.ok) {
    throw new Error(`GitHub request failed: ${response.status} ${response.statusText} for ${url}`);
  }

  return response.json();
}
