import type { MenuContext, MenuScreen, MenuView } from "../../types/menu";
import { byId } from "../dom";
import { achievementsScreen } from "./achievementsScreen";
import { controlsScreen } from "./controlsScreen";
import { coopScreen } from "./coopScreen";
import { heroScreen } from "./heroScreen";
import { mainScreen } from "./mainScreen";
import { focusEntry } from "./menuNav";
import { menuContext, menuScreen } from "./menuState";
import { optionsScreen } from "./optionsScreen";
import { resultScreen } from "./resultScreen";
import { shopScreen } from "./shopScreen";

const root = byId("menu");
const title = byId("menuTitle");
const subtitle = byId("menuSub");
const body = byId("menuBody");

const SCREENS: Record<MenuScreen, (context: MenuContext) => MenuView> = {
  main: mainScreen,
  controls: controlsScreen,
  options: optionsScreen,
  shop: shopScreen,
  result: resultScreen,
  hero: heroScreen,
  coop: coopScreen,
  achievements: achievementsScreen,
};

let shown: { context: MenuContext | null; screen: MenuScreen; state?: string } = { context: null, screen: "main" };

export const menuBody = (): HTMLElement => body;

/**
 * Draw the menu for the current state. On a new screen the entry the screen names takes focus, else the first one, or,
 * coming back to the main screen, the entry that opened the last one; redrawing the same screen keeps the focused entry,
 * unless the screen says its state changed.
 */
export function renderMenu(): void {
  const context = menuContext();
  const screen = menuScreen();
  document.body.dataset.menu = context ?? "none";
  root.hidden = !context;
  if (!context) {
    body.replaceChildren();
    shown = { context, screen };
    return;
  }
  const entries = () => [...body.querySelectorAll<HTMLElement>("[data-nav]")];
  const same = shown.context === context && shown.screen === screen;
  const from = shown.context === context ? shown.screen : null;
  const focused = entries().indexOf(document.activeElement as HTMLElement);
  const view = SCREENS[screen](context);
  const keep = same && view.state === shown.state ? focused : -1;
  title.textContent = view.title;
  subtitle.replaceChildren(view.subtitle);
  root.dataset.screen = screen;
  root.dataset.context = context;
  body.replaceChildren(view.content);
  shown = { context, screen, state: view.state };
  const list = entries();
  const back = list.find((el) => el.dataset.opens === from);
  focusEntry(keep >= 0 ? list[keep] : (back ?? view.focus ?? list[0]));
}
