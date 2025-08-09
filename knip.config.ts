import type { KnipConfig } from "knip";

const config: KnipConfig = {
  // Entry points for the project
  entry: [
    "src/pages/**/*.{astro,tsx,ts}",
    "src/layouts/**/*.{astro,tsx,ts}",
    "scripts/**/*.{ts,js}",
  ],

  // Project files to analyze
  project: [
    "src/**/*.{astro,tsx,ts,js,jsx}",
    "scripts/**/*.{ts,js}",
    "!src/**/*.test.{ts,tsx}",
    "!src/**/*.spec.{ts,tsx}",
  ],

  // Astro plugin configuration
  astro: {
    entry: ["src/pages/**/*.{astro,tsx,ts}", "src/content/config.ts"],
  },

  // TypeScript configuration
  typescript: {
    config: ["tsconfig.json"],
  },

  // Ignore patterns
  ignore: [
    "dist/**",
    ".astro/**",
    "node_modules/**",
    "coverage/**",
    "**/*.d.ts",
    "public/**",
    "content/**",
    ".devcontainer/**",
  ],

  // Ignore specific dependencies that are used indirectly
  ignoreDependencies: [
    // Used in Tailwind config
    "@tailwindcss/typography",
    // Used by satori
    "satori-html",
    // Icon sets used via astro-icon
    "@iconify-json/cib",
    "@iconify-json/lucide",
    // DaisyUI is a Tailwind plugin
    "daisyui",
    // Tailwind is used via Vite plugin
    "tailwindcss",
    // puppeteer is used for Map generation
    "puppeteer",
  ],

  // Ignore specific exports (common false positives)
  ignoreExportsUsedInFile: true,

  // Report only certain issue types
  rules: {
    files: "error",
    dependencies: "error",
    devDependencies: "error",
    exports: "error",
    types: "error",
    duplicates: "warn",
  },
};

export default config;
