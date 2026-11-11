import { eachHero } from "./coopHooks";
import { tickBeat } from "./hero/jory/beat";
import { character, game } from "./state";

/**
 * The shared beat clock: one fixed step of the fight's time for every seat whose hero keeps a beat (Jory). It runs
 * from `stepGame` before hit-stop and before the update, so it keeps counting through hit-stop and slow motion and the
 * beats stay evenly spaced in real time; the pick, the chest, the pause menu and the menus stop it. With no Jory in
 * the run it does nothing. Only the first Jory in a room plays the tick.
 */
export function advanceBeats(dt: number): void {
  if (game.mode !== "play") return;
  let sound = true;
  eachHero(() => {
    if (character.kit !== "jory") return;
    tickBeat(dt, sound);
    sound = false;
  });
}
