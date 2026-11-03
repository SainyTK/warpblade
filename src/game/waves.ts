import { ENEMIES } from "../constants/enemies";
import { GROUND, W } from "../constants/stage";
import { STAGE_WAVES } from "../constants/waves";
import { sfx } from "../services/audio";
import { saveBest } from "../services/bestScore";
import type { EnemyType } from "../types/enemy";
import { waveFoes, waveKind } from "../utils/waves";
import { createRift } from "./effects/rift";
import { endWave } from "./endWave";
import { makeEnemy } from "./enemies/enemy";
import { resetRun } from "./run";
import { game, hero, rng, showBanner } from "./state";

/** rift height and spawn height by foe */
const RIFT: Record<EnemyType, { height: number; y: () => number; riftY: (y: number) => number }> = {
  wisp: { height: 11, y: () => rng.range(40, 100), riftY: (y) => y },
  husk: { height: 16, y: () => GROUND, riftY: () => GROUND - 14 },
  brute: { height: 26, y: () => GROUND, riftY: () => GROUND - 22 },
  warden: { height: 30, y: () => 60, riftY: (y) => y },
};

function spawnX(): number {
  const x = rng.range(30, W - 30);
  return Math.abs(x - hero.x) < 60 ? ((x + 160) % (W - 60)) + 30 : x;
}

function startWave(): void {
  game.wave++;
  game.lull = "fight";
  if (game.wave > game.best) {
    game.best = game.wave;
    saveBest(game.best);
  }
  const kind = waveKind(game.wave);
  const foes = waveFoes(game.wave);
  const leader = ENEMIES[foes[0]].name;
  showBanner(kind === "normal" ? `Wave ${game.wave}` : `Wave ${game.wave}: ${leader}`, kind === "normal" ? 1.4 : 2.2);
  foes.forEach((type, i) => {
    const r = RIFT[type];
    const x = type === "warden" ? (hero.x < W / 2 ? W - 70 : 70) : spawnX();
    const y = r.y();
    game.fx.push(
      createRift(x, r.riftY(y), r.height, i * 0.25, () => {
        const e = makeEnemy(type, x, y, game.wave);
        if (type === "warden" && game.wave === STAGE_WAVES) e.phase = 2;
        game.enemies.push(e);
      }),
    );
  });
}

/** fight a wave; once it is clear, wait, then open rifts for the next wave */
export function updateWaves(dt: number): void {
  if (hero.state === "dead") return;
  if (game.mode === "clear") {
    game.waveTimer -= dt;
    if (game.waveTimer <= 0) resetRun();
    return;
  }
  if (game.enemies.length > 0 || game.fx.some((f) => f.rift)) return;
  if (game.lull === "fight") {
    if (game.wave >= STAGE_WAVES) {
      game.mode = "clear";
      game.waveTimer = 6;
      showBanner(`Stage ${game.stage} clear`, 6);
      sfx.levelUp();
      return;
    }
    endWave();
    return;
  }
  game.waveTimer -= dt;
  if (game.waveTimer > 0) return;
  startWave();
}
