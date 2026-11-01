import { GROUND, W } from "../constants/stage";
import { createRift } from "./effects/rift";
import { makeEnemy } from "./enemies/enemy";
import { game, hero, rng, showBanner } from "./state";

const WAVE_GAP = 2.2;

/** when the stage is clear, open rifts for the next wave: more foes each time, husks from wave 2 */
export function updateWaves(dt: number): void {
  if (hero.state === "dead" || game.enemies.length > 0 || game.fx.some((f) => f.rift)) return;
  game.waveTimer -= dt;
  if (game.waveTimer > 0) return;
  game.wave++;
  game.waveTimer = WAVE_GAP;
  showBanner(`Wave ${game.wave}`, 1.4);
  const count = Math.min(2 + game.wave, 7);
  const husks = Math.min(Math.floor(game.wave / 2), 3);
  for (let i = 0; i < count; i++) {
    const type = i < husks ? "husk" : "wisp";
    let x = rng.range(30, W - 30);
    if (Math.abs(x - hero.x) < 60) x = ((x + 160) % (W - 60)) + 30;
    const y = type === "husk" ? GROUND : rng.range(40, 100);
    const riftY = type === "husk" ? GROUND - 14 : y;
    game.fx.push(
      createRift(x, riftY, type === "husk" ? 16 : 11, i * 0.25, () => game.enemies.push(makeEnemy(type, x, y))),
    );
  }
}
