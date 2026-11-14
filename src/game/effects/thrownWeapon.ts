import { WARP } from "../../constants/combat";
import { HERO_COLORS as HC } from "../../constants/palette";
import { glow, glowLine, hairline, place } from "../../engine/frame";
import { blit, detailCanvas } from "../../engine/sprite";
import type { Projectile } from "../../types/effect";
import type { WarpTarget } from "../../types/hero";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { enemyCenter } from "../enemies/enemy";
import { skin } from "../hero/skin";
import { particles, rng } from "../state";

/** how far apart the wake's two outer threads open at its old end */
const WAKE_SPREAD = 2;

/**
 * A hero's thrown weapon flying at its target and homing on a moving foe, with a wake in the hero's colours; `body`
 * draws the weapon itself, and `onMove` hears each step of its flight.
 */
export function createThrownWeapon(
  x: number,
  y: number,
  target: WarpTarget,
  body: (x: number, y: number, angle: number, t: number) => void,
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
      // the wake: two fine threads that open behind the weapon and a brighter one between them, thinning with age
      for (let i = 1; i < trail.length; i++) {
        const [ax, ay] = trail[i - 1];
        const [bx, by] = trail[i];
        const young = i / trail.length;
        const spread = (1 - young) * WAKE_SPREAD;
        hairline(ax - n * spread, ay + c * spread, bx - n * spread, by + c * spread, skin.ramp[2], young * 0.7);
        hairline(ax + n * spread, ay - c * spread, bx + n * spread, by - c * spread, skin.ramp[2], young * 0.7);
        hairline(ax, ay, bx, by, skin.ramp[i > 5 ? 5 : 3], young);
      }
      body(s.x, s.y, angle, t);
    },
  };
  return s;
}

/** the thrown sword is drawn into its own canvas, turned along the flight, then copied */
const thrownCanvas = detailCanvas(80, 80, 40, 40);

/**
 * The hero's own sword flying point first, its point at (x, y): the blade's own drawing (`HeroSkin.blade`) turned along
 * the flight, with a glow in the hero's colours. The shared look of every hero's thrown sword; a kit may draw its own
 * (`WarpStyle.drawThrown`).
 */
export function drawThrownBlade(x: number, y: number, angle: number): void {
  const reach = skin.blade.reach;
  const c = Math.cos(angle);
  const n = Math.sin(angle);
  thrownCanvas.clear();
  skin.blade.draw(thrownCanvas, [-c * reach, -n * reach], angle, 0);
  thrownCanvas.outline(HC.outline);
  blit(thrownCanvas, x, y, false);
  place();
  glowLine(x - c * (reach - 1), y - n * (reach - 1), x, y, 6, skin.ramp[3], 0.45);
  glow(x, y, 8, WHITE, 0.2);
}
