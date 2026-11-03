import { STAGE_WAVES, WAVE_PAUSE } from "../constants/waves";
import { queuePick } from "./progress";
import { game, hero } from "./state";

/** a cleared wave gives one pick, then the pause before the next wave's rifts */
export function endWave(): void {
  game.lull = "toNext";
  game.waveTimer = WAVE_PAUSE;
  queuePick({ kind: "wave", wave: game.wave });
}

/**
 * Called after every kill, so the pick opens as the wave's last foe falls, right behind any level up from that kill.
 * The last wave ends the stage instead and the run starts over, so it gives no pick.
 */
export function endWaveOnLastKill(): void {
  if (hero.state === "dead" || game.lull !== "fight" || game.wave >= STAGE_WAVES) return;
  if (game.enemies.some((e) => e.hp > 0) || game.fx.some((f) => f.rift)) return;
  endWave();
}
