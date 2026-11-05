import { STAGE_WAVES, WAVE_PAUSE } from "../constants/waves";
import { coop } from "./coopHooks";
import { openPicks } from "./progress";
import { game, hero } from "./state";

/** a cleared wave spends any skill points waiting, then the pause before the next wave's rifts */
export function endWave(): void {
  game.lull = "toNext";
  game.waveTimer = WAVE_PAUSE;
  const room = coop();
  if (room) room.waveCleared();
  else openPicks();
}

/**
 * Called after every kill, so the picks open as the wave's last foe falls.
 * The last wave ends the stage and the run instead, so it opens none.
 */
export function endWaveOnLastKill(): void {
  if (hero.state === "dead" || game.lull !== "fight" || game.wave >= STAGE_WAVES) return;
  if (game.enemies.some((e) => e.hp > 0) || game.fx.some((f) => f.rift)) return;
  endWave();
}
