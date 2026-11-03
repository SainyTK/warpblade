import { STAGE_WAVES } from "../../constants/waves";
import { game, progress } from "../../game/state";
import type { MenuContext, MenuScreen, MenuView } from "../../types/menu";
import { leaveMenu, quitRun, restartRun, startGame } from "./menuActions";
import { menuItem } from "./menuItem";
import { showScreen } from "./menuState";

const REPO = "https://github.com/SainyTK/warpblade";

function screenItem(label: string, screen: MenuScreen): HTMLButtonElement {
  const item = menuItem(label, () => showScreen(screen));
  item.dataset.opens = screen;
  return item;
}

function titleFooter(): HTMLElement {
  const footer = document.createElement("p");
  footer.className = "menu-foot";
  if (game.best) footer.append(`Best wave ${game.best}. `);
  const link = document.createElement("a");
  link.href = REPO;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "Source on GitHub";
  footer.append(link);
  return footer;
}

/** Start, Shop, Controls and Options before a run; on pause, Resume, Restart run, Controls, Options and Quit run */
export function mainScreen(context: MenuContext): MenuView {
  const list = document.createElement("nav");
  list.className = "menu-list";
  list.setAttribute("aria-label", context === "title" ? "Start menu" : "Pause menu");
  if (context === "title") {
    list.append(
      menuItem("Start", startGame),
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
