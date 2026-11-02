import { byId } from "./dom";
import { pauseGame } from "./menu/menuActions";

/** the on-screen pause button, for mouse and touch players */
export function bindPauseButton(): void {
  byId("pauseButton").addEventListener("click", pauseGame);
}
