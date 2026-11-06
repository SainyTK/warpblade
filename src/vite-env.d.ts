/// <reference types="vite/client" />

/** the game version from package.json, set by vite.config.ts */
declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  /** the GA4 measurement ID (G-...), set in Vercel; analytics stays off without it */
  readonly VITE_GA_MEASUREMENT_ID?: string;
}
