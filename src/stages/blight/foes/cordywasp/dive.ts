import { GROUND } from "../../../../constants/stage";
import { eachStanding } from "../../../../game/coopHooks";
import { enemyBox } from "../../../../game/enemies/enemy";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, hero, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { WASP } from "./colors";
import { WASP_HITS, WASP_MOVE } from "./moves";

interface DivePath {
  dx: number;
  dy: number;
  left: number;
}

const paths = new WeakMap<Enemy, DivePath>();

export function startDive(e: Enemy): void {
  const tx = hero.x;
  const ty = hero.y - 10;
  const dist = Math.hypot(tx - e.x, ty - e.y) || 1;
  paths.set(e, { dx: (tx - e.x) / dist, dy: (ty - e.y) / dist, left: dist + WASP_MOVE.past });
  Object.assign(e, { state: "dive", st: 0, n: 0, face: Math.sign(tx - e.x) || e.face });
  sfx.lunge();
}

export function dive(e: Enemy, dt: number): void {
  const path = paths.get(e);
  if (!path) {
    Object.assign(e, { state: "recover", st: 0 });
    return;
  }
  const step = WASP_MOVE.dive * dt;
  e.vx = path.dx * WASP_MOVE.dive;
  e.vy = path.dy * WASP_MOVE.dive;
  e.x += path.dx * step;
  e.y += path.dy * step;
  path.left -= step;
  if (fxRng.chance(0.6))
    particles.spawn(PK.MOTE, e.x - path.dx * 8, e.y - path.dy * 8, 0, 0, 0.3, { col: WASP.bulb[2], size: 0.5 });
  eachStanding(() => {
    if (e.n === 0 && boxHit(enemyBox(e), heroBox())) {
      e.n = 1;
      hurtHero(WASP_HITS.sting * e.power, e.x);
    }
  });
  if (path.left <= 0 || e.y >= GROUND - 8 || e.pinned > 0) {
    paths.delete(e);
    Object.assign(e, { state: "recover", st: 0, vx: path.dx * 40, vy: -20 });
  }
}
