import { WARP } from "../../constants/combat";
import { HERO_COLORS as HC } from "../../constants/palette";
import { glow, glowLine, line, place } from "../../engine/frame";
import type { Projectile } from "../../types/effect";
import type { WarpTarget } from "../../types/hero";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { enemyCenter } from "../enemies/enemy";
import { skin } from "../hero/skin";
import { particles, rng } from "../state";

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
      for (let i = 1; i < trail.length; i++)
        line(trail[i - 1][0], trail[i - 1][1], trail[i][0], trail[i][1], skin.ramp[i > 5 ? 4 : 2], i / trail.length);
      const c = Math.cos(angle);
      const n = Math.sin(angle);
      line(s.x - c * 15, s.y - n * 15, s.x, s.y, (u) => (u > 0.85 ? WHITE : u < 0.15 ? HC.trim : HC.blade));
      line(s.x - c * 13 - n, s.y - n * 13 + c, s.x - c * 2 - n, s.y - n * 2 + c, HC.bladeEdge);
      glowLine(s.x - c * 14, s.y - n * 14, s.x, s.y, 7, skin.ramp[3], 0.5);
      glow(s.x, s.y, 10, WHITE, 0.25);
    },
  };
  return s;
}
