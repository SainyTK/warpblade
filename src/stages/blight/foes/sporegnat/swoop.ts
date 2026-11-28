import { clampStageX } from "../../../../game/adventure";
import { eachStanding } from "../../../../game/coopHooks";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { hero } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { clamp, lerp } from "../../../../utils/math";
import { GNAT_HITS, GNAT_MOVE, GNAT_TIMES } from "./moves";

interface SwoopPath {
  fromX: number;
  fromY: number;
  toX: number;
  bottom: number;
}

const paths = new WeakMap<Enemy, SwoopPath>();

export function startSwoop(e: Enemy): void {
  const side = Math.sign(hero.x - e.x) || e.face;
  paths.set(e, {
    fromX: e.x,
    fromY: e.y,
    toX: clampStageX(hero.x + side * GNAT_MOVE.past, 10),
    bottom: Math.max(e.y + 10, hero.y - GNAT_MOVE.low),
  });
  Object.assign(e, { state: "dive", st: 0, n: 0, face: side, vx: 0, vy: 0 });
  sfx.swing(2.2);
}

export function swoop(e: Enemy): void {
  const path = paths.get(e);
  if (!path) {
    Object.assign(e, { state: "recover", st: 0 });
    return;
  }
  const u = clamp(e.st / GNAT_TIMES.swoop);
  e.x = lerp(path.fromX, path.toX, u);
  e.y = lerp(path.fromY, path.bottom, Math.sin(Math.PI * u));
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(GNAT_HITS.swoop * e.power, e.x);
    }
  });
  if (u < 1) return;
  paths.delete(e);
  Object.assign(e, { state: "recover", st: 0, vx: e.face * 20, vy: -20 });
}
