import { SITE_PAGES, type SitePageId } from "../../constants/sitePages";
import { el, link } from "../dom";
import { siteHeader } from "./siteHeader";

/** Builds a site page into #app: a skip link, the header and the page title. Returns the main element to fill. */
export function mountPage(current: SitePageId): HTMLElement {
  const app = document.getElementById("app");
  if (!app) throw new Error("the page is missing #app");
  const page = SITE_PAGES.find((item) => item.id === current);

  const main = el("main", "site-container site-main");
  main.id = "content";
  main.tabIndex = -1;
  main.append(el("h1", "page-title", page?.label));

  app.replaceChildren(link("#content", "Skip to content", "skip-link"), siteHeader(current), main);
  return main;
}
