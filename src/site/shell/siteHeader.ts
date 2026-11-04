import { GAME_HREF, SITE_PAGES, type SitePageId } from "../../constants/sitePages";
import { el, link } from "../dom";

/** the bar at the top of every site page: the brand back to the game, the pages, and Play */
export function siteHeader(current: SitePageId): HTMLElement {
  const header = el("header", "site-header");
  const inner = el("div", "site-container site-header-inner");

  const brand = link(GAME_HREF, "", "site-brand");
  const icon = el("img", "site-brand-icon");
  icon.src = "/favicon.svg";
  icon.alt = "";
  icon.width = 20;
  icon.height = 20;
  brand.append(icon, "Warpblade");

  const nav = el("nav", "site-nav");
  nav.setAttribute("aria-label", "Site");
  for (const page of SITE_PAGES) {
    const item = link(page.href, page.label, "site-nav-link");
    if (page.id === current) item.setAttribute("aria-current", "page");
    nav.append(item);
  }

  inner.append(brand, nav, link(GAME_HREF, "Play", "button button-play"));
  header.append(inner);
  return header;
}
