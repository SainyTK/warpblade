import { dealDamage } from "../../../../game/damage";
import { createImpact } from "../../../../game/effects/impact";
import { createSlash } from "../../../../game/effects/slash";
import { enemyCenter } from "../../../../game/enemies/enemy";
import { game, hero, lights } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { TIER_EFFECT } from "../../constants/drill/statuses";
import { DUSK_RAMP, DUSK_SPARKS, NIGHT_RAMP } from "../../look/colors";
import { drawPhantom } from "../phantom";
import { vesperSound } from "../sound";
import { later } from "./later";

const CUT_A = { cx: 0, cy: 0, R: 15, sy: 0.9, rot: 0.7, a0: -2.5, a1: 0.9, W: 5, sweep: 0.03, trail: 0.16 };
const CUT_B = { ...CUT_A, rot: -0.7, ramp: NIGHT_RAMP };

interface Ghost {
  x: number;
  y: number;
  face: number;
  life: number;
}

const ghosts: Ghost[] = [];

function cutOnce(foe: Enemy, damage: number, source: string, side: number): void {
  if (foe.hp <= 0) {
    return;
  }
  const [x, y] = enemyCenter(foe);
  ghosts.push({ x: foe.x + side * 12, y: foe.y, face: -side, life: TIER_EFFECT.phantomLife });
  game.fx.push(createSlash(x, y, -side, { ...CUT_A, ramp: DUSK_RAMP }));
  game.fx.push(createSlash(x, y, side, CUT_B));
  game.fx.push(createImpact(x, y, -side, false, DUSK_SPARKS));
  lights.add(x, y, 22, DUSK_RAMP[4], 0.6, 0.2);
  dealDamage(foe, damage, { fromX: foe.x + side * 12, kx: -side * 10, source });
  vesperSound.dart();
}

export function dance(foes: readonly Enemy[], cuts: number, damage: number, source: string): void {
  let step = 0;
  for (let round = 0; round < cuts; round++) {
    for (const foe of foes) {
      const side = (step % 2 === 0 ? 1 : -1) * (Math.sign(foe.x - hero.x) || hero.face);
      later(step * TIER_EFFECT.danceGap, () => cutOnce(foe, damage, source, side));
      step++;
    }
  }
}

export function tickDance(dt: number): void {
  for (const ghost of ghosts) {
    ghost.life -= dt;
  }
  const alive = ghosts.filter((ghost) => ghost.life > 0);
  ghosts.length = 0;
  ghosts.push(...alive);
}

export function drawDance(): void {
  for (const ghost of ghosts) {
    drawPhantom(ghost.x, ghost.y, ghost.face, Math.min(1, (ghost.life / TIER_EFFECT.phantomLife) * 1.6));
  }
}

export function resetDance(): void {
  ghosts.length = 0;
}
