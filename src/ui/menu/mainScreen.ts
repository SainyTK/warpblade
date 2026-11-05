import { REPO_URL } from "../../constants/feedback";
import { GAME_VERSION, SITE_PAGES } from "../../constants/sitePages";
import { STAGE_WAVES } from "../../constants/waves";
import { applySkin } from "../../game/hero/skin";
import { character, game, progress } from "../../game/state";
import type { MenuContext, MenuScreen, MenuView } from "../../types/menu";
import { leaveMenu, quitRun, restartRun } from "./menuActions";
import { menuItem } from "./menuItem";
import { showScreen } from "./menuState";

function screenItem(label: string, screen: MenuScreen): HTMLButtonElement {
  const item = menuItem(label, () => showScreen(screen));
  item.dataset.opens = screen;
  return item;
}

/** a footer link; one to GitHub opens in a new tab so the game stays open */
function footLink(href: string, label: string): HTMLAnchorElement {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = label;
  if (href.startsWith("http")) {
    link.target = "_blank";
    link.rel = "noopener";
  }
  return link;
}

/** the best wave, then the patch notes, feedback, source and version as one line that wraps between items */
function titleFooter(): HTMLElement {
  const footer = document.createElement("p");
  footer.className = "menu-foot";
  if (game.best) footer.append(`Best wave ${game.best}. `);
  const links = document.createElement("span");
  links.className = "menu-foot-links";
  const source = footLink(REPO_URL, "Source on GitHub");
  const version = document.createElement("span");
  version.textContent = `v${GAME_VERSION}`;
  links.append(...SITE_PAGES.map((page) => footLink(page.href, page.label)), source, version);
  footer.append(links);
  return footer;
}

/** Start, Shop, Controls and Options before a run; on pause, Resume, Restart run, Controls, Options and Quit run */
export function mainScreen(context: MenuContext): MenuView {
  const list = document.createElement("nav");
  list.className = "menu-list";
  list.setAttribute("aria-label", context === "title" ? "Start menu" : "Pause menu");
  if (context === "title") {
    // a hero only looked at on the hero screen goes back to the one chosen
    applySkin(character.skin);
    list.append(
      screenItem("Start", "hero"),
      screenItem("Shop", "shop"),
      screenItem("Controls", "controls"),
      screenItem("Options", "options"),
    );
    const content = document.createElement("div");
    content.className = "menu-main";
    content.append(list, titleFooter());
    return { title: "Warpblade", subtitle: "Throw the sword. Become the sword.", content };
  }
  list.append(
    menuItem("Resume", leaveMenu),
    menuItem("Restart run", restartRun, "Restart? Press again"),
    screenItem("Controls", "controls"),
    screenItem("Options", "options"),
    menuItem("Quit run", quitRun, "Quit? Press again"),
  );
  return {
    title: "Paused",
    subtitle: `Wave ${game.wave} of ${STAGE_WAVES}, level ${progress.level}`,
    content: list,
  };
}
