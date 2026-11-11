import { PICK_DELAY, STAGE_WAVES, WAVE_PAUSE } from "../constants/waves";
import { streamLeft } from "../utils/waves";
import { coop } from "./coopHooks";
import { feat } from "./feat";
import { openPicks } from "./progress";
import { character, game, hero } from "./state";

/** no foe standing, no rift open and none of the wave's stream left to come */
export const fightOver = (): boolean =>
  game.enemies.every((e) => e.hp <= 0) && !game.fx.some((f) => f.rift) && streamLeft(game.stream) === 0;

/** a cleared wave starts the pause before the next wave's rifts; the skill picks open a beat into it */
export function endWave(): void {
  game.lull = "cleared";
  game.waveTimer = WAVE_PAUSE;
  feat({ kind: "waveCleared", wave: game.wave, hero: character.id });
}

/** the beat after the last foe fell is over: spend any skill points waiting, then the rest of the pause */
export function settleWave(): void {
  if (game.lull !== "cleared" || game.waveTimer > WAVE_PAUSE - PICK_DELAY) return;
  game.lull = "toNext";
  const room = coop();
  if (room) room.waveCleared();
  else openPicks();
}

/**
 * Called after every kill, so the pause starts as the last foe of the wave's whole stream falls.
 * The last wave ends the stage and the run instead, so it starts none.
 */
export function endWaveOnLastKill(): void {
  if (hero.state === "dead" || game.lull !== "fight" || game.wave >= STAGE_WAVES) return;
  if (!fightOver()) return;
  endWave();
}
