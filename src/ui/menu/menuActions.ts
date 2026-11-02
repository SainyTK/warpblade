import { clearPresses, releaseAll } from "../../game/input";
import { resetRun } from "../../game/run";
import { game, hero } from "../../game/state";
import { byId } from "../dom";
import { closeMenu, isMenuOpen, openMenu } from "./menuState";

const canvas = byId<HTMLCanvasElement>("game");

/** back to the game; keys held or pressed in the menu do nothing there */
export function leaveMenu(): void {
  releaseAll();
  clearPresses();
  closeMenu();
  canvas.focus({ preventScroll: true });
}
export function restartRun(): void {
  resetRun("Run restarted");
  leaveMenu();
}
/** end the run and go back to the start menu, with Kael standing fresh behind it */
export function quitRun(): void {
  resetRun("");
  hero.inv = 0;
  openMenu("title");
}
/** freeze the game under the pause menu; the skill tree has its own window and is never paused over */
export function pauseGame(): void {
  if (isMenuOpen() || game.mode === "skills") return;
  releaseAll();
  openMenu("pause");
}
