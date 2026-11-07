import { clearPresses, releaseAll } from "../../game/input";
import { resetRun } from "../../game/run";
import { startRun } from "../../game/startRun";
import { game, hero } from "../../game/state";
import { inRoom } from "../../store/coop";
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
/** a new run from the start menu, with everything bought in the shop */
export function startGame(): void {
  startRun("");
  leaveMenu();
}
export function restartRun(): void {
  startRun("Run restarted");
  leaveMenu();
}
/** end the run and go back to the start menu, with Kael standing fresh behind it */
export function quitRun(): void {
  resetRun("");
  hero.inv = 0;
  openMenu("title");
}
/**
 * freeze the game under the pause menu; in solo play a level-up pick or an opened chest already holds the game and is never paused over.
 * A room plays on under the menu, and its players may still pause while anyone picks, to leave the room
 */
export function pauseGame(): void {
  if (isMenuOpen() || ((game.mode === "pick" || game.mode === "chest") && !inRoom())) return;
  releaseAll();
  openMenu("pause");
}
