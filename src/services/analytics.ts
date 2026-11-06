import { ANALYTICS_HOST, GA_MEASUREMENT_ID } from "../constants/analytics";

// Google Analytics 4, on the live site only

type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

/** load gtag.js and record the page view; call once per page */
export function startAnalytics(): void {
  if (window.location.hostname !== ANALYTICS_HOST || window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // gtag.js reads the arguments object itself, so it must be pushed as is
    window.dataLayer?.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { app_version: __APP_VERSION__ });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.append(script);
}

/** send a game event; does nothing when analytics is off */
export function track(event: string, params: Record<string, string | number | boolean>): void {
  window.gtag?.("event", event, params);
}
