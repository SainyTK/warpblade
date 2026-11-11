import { WARP } from "../../constants/combat";
import { HERO_COLORS as HC } from "../../constants/palette";
import { fleck, glow, glowLine, hairline, line, place } from "../../engine/frame";
import type { Projectile } from "../../types/effect";
import type { WarpTarget } from "../../types/hero";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { enemyCenter } from "../enemies/enemy";
import { skin } from "../hero/skin";
import { particles, rng } from "../state";

/** the flying sword: its length from pommel to point, where the blade starts and how far the guard reaches */
const BLADE = { length: 16, grip: 3.5, guard: 2.2 } as const;
/** how far apart the wake's two outer threads open at its old end */
const WAKE_SPREAD = 2;

/** the crystal sword flying point first, homing on a moving target; `onMove` hears each step of its flight */
export function createThrownSword(
  x: number,
  y: number,
  target: WarpTarget,
  onMove?: (ax: number, ay: number, bx: number, by: number) => void,
): Projectile {
  const trail: [number, number][] = [];
  const aim = (): [number, number] => (target.enemy ? enemyCenter(target.enemy) : [target.x, target.y]);
  let [tx, ty] = aim();
  let angle = Math.atan2(ty - y, tx - x);
  let t = 0;
  const s: Projectile = {
    x,
    y,
    done: false,
    update(dt) {
      t += dt;
      if (target.enemy && target.enemy.hp > 0) [tx, ty] = aim();
      const dx = tx - s.x;
      const dy = ty - s.y;
      const d = Math.hypot(dx, dy);
      angle = Math.atan2(dy, dx);
      trail.push([s.x, s.y]);
      if (trail.length > 9) trail.shift();
      if (rng.chance(0.4))
        particles.spawn(
          PK.MOTE,
          s.x,
          s.y,
          -Math.cos(angle) * 40 + rng.range(-15, 15),
          -Math.sin(angle) * 40 + rng.range(-15, 15),
          rng.range(0.15, 0.3),
          {
            col: skin.ramp[4],
            size: 0.5,
          },
        );
      const [ax, ay] = [s.x, s.y];
      if (d <= WARP.speed * dt || t > WARP.maxFlight) {
        s.x = tx;
        s.y = ty;
        s.done = true;
      } else {
        s.x += (dx / d) * WARP.speed * dt;
        s.y += (dy / d) * WARP.speed * dt;
      }
      onMove?.(ax, ay, s.x, s.y);
    },
    draw() {
      place();
      const c = Math.cos(angle);
      const n = Math.sin(angle);
      // the wake: two fine threads that open behind the blade and a brighter one between them, thinning with age
      for (let i = 1; i < trail.length; i++) {
        const [ax, ay] = trail[i - 1];
        const [bx, by] = trail[i];
        const young = i / trail.length;
        const spread = (1 - young) * WAKE_SPREAD;
        hairline(ax - n * spread, ay + c * spread, bx - n * spread, by + c * spread, skin.ramp[2], young * 0.7);
        hairline(ax + n * spread, ay - c * spread, bx + n * spread, by - c * spread, skin.ramp[2], young * 0.7);
        hairline(ax, ay, bx, by, skin.ramp[i > 5 ? 5 : 3], young);
      }
      const at = (d: number, w: number): [number, number] => [
        s.x - c * (BLADE.length - d) - n * w,
        s.y - n * (BLADE.length - d) + c * w,
      ];
      const [tipX, tipY] = at(BLADE.length, 0);
      const [neckX, neckY] = at(BLADE.grip, 0);
      line(neckX, neckY, tipX, tipY, HC.blade);
      hairline(...at(BLADE.grip, 0.5), ...at(BLADE.length - 1.5, 0.5), HC.bladeBack);
      hairline(...at(BLADE.grip, -0.25), ...at(BLADE.length, -0.25), (u) => (u > 0.8 ? WHITE : HC.bladeEdge));
      hairline(...at(0, 0), neckX, neckY, HC.hilt);
      hairline(...at(BLADE.grip, -BLADE.guard), ...at(BLADE.grip, BLADE.guard), HC.trim);
      fleck(...at(0, 0), HC.trimLight);
      fleck(tipX, tipY, WHITE);
      glowLine(...at(1, 0), s.x, s.y, 6, skin.ramp[3], 0.45);
      glow(s.x, s.y, 8, WHITE, 0.2);
    },
  };
  return s;
}
