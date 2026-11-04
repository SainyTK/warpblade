/** The pages beside the game, linked from the site header and the start menu footer. */
export type SitePageId = "patches" | "feedback";

export interface SitePage {
  id: SitePageId;
  label: string;
  href: string;
}

export const SITE_PAGES: readonly SitePage[] = [
  { id: "patches", label: "Patch notes", href: "/patches/" },
  { id: "feedback", label: "Feedback", href: "/feedback/" },
];

export const GAME_HREF = "/";
export const GAME_VERSION = __APP_VERSION__;
