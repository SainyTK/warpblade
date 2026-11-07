import { RITE_RAMP, RITE_SPARKS } from "../../../constants/ysra/emberLook";
import { CINDER_LASH as L } from "../../../constants/ysra/rites";
import { glow, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import type { Box } from "../../../types/world";
import { WHITE } from "../../../utils/color";
import { ease } from "../../../utils/math";
import { dealDamage } from "../../damage";
import { ignite } from "../../enemies/burn";
import { enemyBox } from "../../enemies/enemy";
import { game, lights, particles, progress, rng } from "../../state";
import { boxHit, hitStop, shake } from "../../world";
import { riteSound } from "./riteSound";

/** the drag: the nearest foe struck is pulled toward her this fast for long enough to cover `L.drag` */
const DRAG_TIME = 0.18;

/** where the lash's tip is `u` of the way along, as a low whip that curls up near the tip */
function along(x: number, floor: number, dir: number, reach: number, u: number): [number, number] {
  const lx = x + dir * reach * u;
  const ly = floor - 6 - Math.sin(u * Math.PI) * 5 - u * u * 4;
  return [lx, ly];
}

/** strike every foe on the lash's line, and drag the nearest of them in */
function strike(x: number, floor: number, dir: number): number {
  const line: Box = dir > 0 ? [x, floor - L.height, x + L.reach, floor] : [x - L.reach, floor - L.height, x, floor];
  let nearest: Enemy | null = null;
  let hits = 0;
  for (const e of game.enemies) {
    if (e.hp <= 0 || !boxHit(line, enemyBox(e))) continue;
    dealDamage(e, progress.stats.ap * L.power, { fromX: x, kx: 0, heavy: true, source: "abilities" });
    ignite(e, L.burn);
    hits++;
    if (!nearest || Math.abs(e.x - x) < Math.abs(nearest.x - x)) nearest = e;
  }
  if (nearest) nearest.vx = (-dir * L.drag) / DRAG_TIME;
  return hits;
}

/**
 * Cinder Lash, her second base rite: a whip of fire lashes low along the floor ahead, strikes every foe on it as it
 * cracks, drags the nearest one in, and recoils into her hand.
 */
export function castCinderLash(x: number, floor: number, dir: number): Effect {
  let t = 0;
  let cracked = false;
  riteSound(L.pitch);
  const reachAt = (): number => (t < L.out ? ease.outCubic(t / L.out) : 1 - Math.min(1, (t - L.out) / L.back) ** 2);
  return {
    update(dt) {
      t += dt;
      if (!cracked && t >= L.out) {
        cracked = true;
        if (strike(x, floor, dir)) hitStop(0.05);
        shake(0.14, 1.8);
        const [tx, ty] = along(x, floor, dir, L.reach, 1);
        lights.add(tx, ty, 36, RITE_RAMP[4], 0.8, 0.25);
        for (let i = 0; i < 14; i++)
          particles.spawn(PK.SPARK, tx, ty, rng.range(-120, 120), -rng.range(40, 180), rng.range(0.2, 0.4), {
            sparks: RITE_SPARKS,
          });
      }
      const k = reachAt();
      if (k > 0.1 && rng.chance(0.8)) {
        const [ex, ey] = along(x, floor, dir, L.reach * k, rng.range(0, 1));
        particles.spawn(PK.EMBER, ex, ey, rng.range(-15, 15), -rng.range(15, 45), 0.5, { sparks: RITE_SPARKS });
      }
      return t < L.out + L.back;
    },
    draw() {
      place();
      const reach = L.reach * reachAt();
      const steps = Math.max(2, Math.ceil(reach));
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const [lx, ly] = along(x, floor, dir, reach, u);
        const hot = u > 0.8;
        px(lx, ly, hot ? RITE_RAMP[5] : RITE_RAMP[4]);
        px(lx, ly + 1, RITE_RAMP[u < 0.4 ? 2 : 3]);
        if (hot && t < L.out + 0.04) px(lx, ly - 1, WHITE);
      }
      const [tx, ty] = along(x, floor, dir, reach, 1);
      glow(tx, ty, 10, RITE_RAMP[4], 0.5);
    },
  };
}
