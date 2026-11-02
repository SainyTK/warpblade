import { onFullscreenChange } from "../../services/fullscreen";
import { onSettingsChange } from "../../store/settings";
import type { MenuCommand } from "../../types/input";
import { leaveMenu } from "./menuActions";
import { runMenuCommand } from "./menuNav";
import { isMenuOpen, menuContext, menuScreen, onMenuChange, showScreen } from "./menuState";
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
  const redrawOptions = () => {
    if (isMenuOpen() && menuScreen() === "options") renderMenu();
  };
  onMenuChange(renderMenu);
  onSettingsChange(redrawOptions);
  onFullscreenChange(redrawOptions);
  // the mouse moves the selection the way the keys do, so there is only ever one highlighted entry
  menuBody().addEventListener("pointermove", (ev) => {
    if (ev.pointerType !== "mouse") return;
    const entry = (ev.target as HTMLElement).closest<HTMLElement>("[data-nav]");
    if (entry && entry !== document.activeElement) entry.focus({ preventScroll: true });
  });
  renderMenu();
}
