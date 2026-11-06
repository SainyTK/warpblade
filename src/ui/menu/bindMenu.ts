import { onRunEnd } from "../../game/runEnd";
import { onFullscreenChange } from "../../services/fullscreen";
import { onRoomChange } from "../../store/coop";
import { onMetaChange } from "../../store/meta";
import { onSettingsChange } from "../../store/settings";
import type { MenuCommand } from "../../types/input";
import type { MenuScreen } from "../../types/menu";
import { leaveMenu } from "./menuActions";
import { runMenuCommand } from "./menuNav";
import { isMenuOpen, menuContext, menuScreen, onMenuChange, openMenu, showScreen } from "./menuState";
import { menuBody, renderMenu } from "./menuView";

/** Esc leaves a screen for the main one, and the pause menu for the game; the start menu stays */
function back(): void {
  if (menuScreen() !== "main") showScreen("main");
  else if (menuContext() === "pause") leaveMenu();
}

export function menuCommand(command: MenuCommand, repeat: boolean): void {
  runMenuCommand(menuBody(), command, repeat, back);
}

export function bindMenu(): void {
  const redrawOn = (screen: MenuScreen) => () => {
    if (isMenuOpen() && menuScreen() === screen) renderMenu();
  };
  onMenuChange(renderMenu);
  onSettingsChange(redrawOn("options"));
  onFullscreenChange(redrawOn("options"));
  onMetaChange(redrawOn("shop"));
  onMetaChange(redrawOn("hero"));
  onMetaChange(redrawOn("achievements"));
  onRoomChange(redrawOn("coop"));
  // a run that ends, cleared or lost, comes back to the start menu with its result
  onRunEnd(() => openMenu("title", "result"));
  // the mouse moves the selection the way the keys do, so there is only ever one highlighted entry
  menuBody().addEventListener("pointermove", (ev) => {
    if (ev.pointerType !== "mouse") return;
    const entry = (ev.target as HTMLElement).closest<HTMLElement>("[data-nav]");
    if (entry && entry !== document.activeElement) entry.focus({ preventScroll: true });
  });
  renderMenu();
}
