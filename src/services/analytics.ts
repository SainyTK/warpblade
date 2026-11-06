/**
 * Google Analytics 4 for the live site. It loads only in a production build with VITE_GA_MEASUREMENT_ID set
 * (a Vercel environment variable), so dev servers, playtest bots and forks without the ID send nothing.
 */
const measurementId = import.meta.env.PROD ? (import.meta.env.VITE_GA_MEASUREMENT_ID ?? "") : "";

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** load gtag.js and record the page view; call once per page */
export function startAnalytics(): void {
  if (!measurementId || window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js reads the arguments object itself, so it must be pushed as is
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", measurementId, { app_version: __APP_VERSION__ });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
  document.head.append(script);
}

/** send a game event; does nothing when analytics is off */
export function track(event: string, params: Record<string, string | number | boolean>): void {
  window.gtag?.("event", event, params);
}
