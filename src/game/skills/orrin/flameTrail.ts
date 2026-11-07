import { FIRE_RAMP } from "../../../constants/palette";
import { glow, place, px } from "../../../engine/frame";
import type { Ramp } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { enemyCenter } from "../../enemies/enemy";
import { game } from "../../state";

/** one flame left hanging in the air */
interface Flame {
  x: number;
  y: number;
  life: number;
  max: number;
}

/** a line of flames left in the air (Scorched Arc, Comet Heel) and when each foe was last burnt by it */
export interface FlameTrail {
  flames: Flame[];
  /** seconds until the next flame may be laid */
  drop: number;
  hit: WeakMap<Enemy, number>;
}

export const newTrail = (): FlameTrail => ({ flames: [], drop: 0, hit: new WeakMap() });

/** lay a flame where he is, no more often than `every` seconds */
export function layFlame(t: FlameTrail, x: number, y: number, life: number, every: number, dt: number): void {
  t.drop -= dt;
  if (t.drop > 0) return;
  t.drop = every;
  t.flames.push({ x, y, life, max: life });
}

/** the flames burn down; a foe touching one is struck, once every `every` seconds */
export function stepTrail(t: FlameTrail, dt: number, reach: number, every: number, strike: (e: Enemy) => void): void {
  for (const f of t.flames) f.life -= dt;
  t.flames = t.flames.filter((f) => f.life > 0);
  if (!t.flames.length) return;
  for (const e of game.enemies) {
    if (e.hp <= 0 || game.t - (t.hit.get(e) ?? -9) < every) continue;
    const [cx, cy] = enemyCenter(e);
    if (!t.flames.some((f) => Math.abs(f.x - cx) < reach + 4 && Math.abs(f.y - cy) < reach + 6)) continue;
    t.hit.set(e, game.t);
    strike(e);
  }
}

/** each flame is a small tongue of fire, two pixels wide at its root, licking up and shrinking as it burns down, white
 *  hot at the root and red at the tip, over a glow in the trail's own colour */
export function drawTrail(t: FlameTrail, tint: Ramp): void {
  place();
  const last = FIRE_RAMP.length - 1;
  for (const f of t.flames) {
    const k = f.life / f.max;
    const flick = Math.sin(game.t * 36 + f.x * 1.9 + f.y);
    const tall = Math.round(1 + 3 * k + (flick > 0.3 ? 1 : 0));
    const root = Math.min(last - 3, Math.floor((1 - k) * 4));
    const sway = flick > 0.6 ? 1 : flick < -0.6 ? -1 : 0;
    for (let j = 0; j < tall; j++) {
      const c = FIRE_RAMP[Math.min(last, root + 1 + Math.round((j / tall) * 4))];
      const x = f.x + (j >= tall - 1 ? sway : 0);
      px(x, f.y - j, c, j ? 0.95 : 1);
      if (j < tall - 2) px(f.x + 1, f.y - j, FIRE_RAMP[Math.min(last, root + 2 + j)], 0.8 * k);
    }
    px(f.x, f.y + 1, tint[2], 0.6 * k);
    glow(f.x, f.y - 1, 6, tint[3], 0.22 * k);
  }
}
