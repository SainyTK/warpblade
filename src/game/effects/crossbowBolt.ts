import { BOLT } from "../../constants/sable/bolt";
import { BOLT_LOOK } from "../../constants/sable/look";
import { W } from "../../constants/stage";
import { glow, glowLine, hairline, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { jadeLight } from "../hero/sable/effects/jadeLight";
import { particles, rng } from "../state";
import { surfaceBelow } from "../world";

export interface BoltFlight {
  x: number;
  y: number;
  /** radians, positive down */
  angle: number;
  ramp: Ramp;
  /** a primed bolt burns white and leaves a brighter trail */
  primed: boolean;
  /** bounces left off the floor or the stage edge */
  bounces: number;
  /** seconds before it appears */
  delay?: number;
  /** pixels it flies before it drops away */
  range?: number;
  /** pixels a second */
  speed?: number;
  /** a heavy bolt is drawn longer and brighter */
  heavy?: boolean;
  /** the stretch it flew this frame; true stops it there */
  pass(ax: number, ay: number, bx: number, by: number): boolean;
  /** it bounced off the stage edge; true burns it primed from then on */
  edge?(): boolean;
}

/** a crossbow bolt: it flies straight, bounces off the floor or a wall while it has bounces, sticks in the floor otherwise */
export function createCrossbowBolt(f: BoltFlight): Effect {
  let { x, y } = f;
  let ux = Math.cos(f.angle);
  let uy = Math.sin(f.angle);
  let flown = 0;
  let stuck = -1;
  let wait = f.delay ?? 0;
  const speed = f.speed ?? BOLT.speed;
  const range = f.range ?? BOLT.range;
  const shaft = f.heavy ? BOLT.shaft * 2 : BOLT.shaft;
  /** the last points the head passed, for the trail */
  const trail: [number, number][] = [[x, y]];
  const spark = (n: number) => {
    for (let i = 0; i < n; i++)
      particles.spawn(PK.SPARK, x, y, rng.range(-60, 60) - ux * 40, -rng.range(20, 80), rng.range(0.15, 0.3), {
        col: f.ramp[5],
      });
  };
  const bounce = (floor: boolean) => {
    f.bounces--;
    if (floor) uy = -Math.abs(uy) || -0.35;
    else {
      ux = -ux;
      if (f.edge?.()) f.primed = true;
    }
    spark(4);
    jadeLight(x, y, "bounce");
  };
  return {
    update(dt) {
      if (wait > 0) {
        wait -= dt;
        return true;
      }
      if (stuck >= 0) {
        stuck += dt;
        return stuck < BOLT.stuck;
      }
      const step = speed * dt;
      const ax = x;
      const ay = y;
      x += ux * step;
      y += uy * step;
      flown += step;
      if (f.pass(ax, ay, x, y)) return false;
      trail.push([x, y]);
      if (trail.length > 6) trail.shift();
      const floor = surfaceBelow(x, ay - 1);
      if (y >= floor) {
        y = floor;
        if (f.bounces > 0) bounce(true);
        else {
          stuck = 0;
          spark(3);
          return true;
        }
      }
      if (x < 4 || x > W - 4) {
        if (f.bounces > 0) bounce(false);
        else return false;
      }
      if (f.primed && rng.chance(0.5)) particles.spawn(PK.MOTE, x, y, -ux * 20, -uy * 20 - 6, 0.3, { col: f.ramp[5] });
      return flown < range;
    },
    draw() {
      if (wait > 0) return;
      place();
      const fade = stuck >= 0 ? 1 - stuck / BOLT.stuck : 1;
      // a bolt that has just stuck shivers about its head
      const shiver =
        stuck >= 0 && stuck < BOLT_LOOK.shiver
          ? Math.sin(stuck * 90) * BOLT_LOOK.shiverAngle * (1 - stuck / BOLT_LOOK.shiver)
          : 0;
      const dx = ux * Math.cos(shiver) - uy * Math.sin(shiver);
      const dy = uy * Math.cos(shiver) + ux * Math.sin(shiver);
      // half an art pixel across the shaft, toward its underside
      const ox = -dy * 0.5;
      const oy = dx * 0.5;
      const tx = x - dx * shaft;
      const ty = y - dy * shaft;
      if (stuck < 0) {
        const [sx, sy] = trail[0];
        const reach = Math.min(f.primed ? BOLT_LOOK.primedTrail : BOLT_LOOK.trail, Math.hypot(x - sx, y - sy));
        const ex = x - ux * reach;
        const ey = y - uy * reach;
        // the trail thins to nothing behind it, two image pixels thick only near the tail of the shaft
        hairline(
          ex,
          ey,
          tx,
          ty,
          (u) => f.ramp[2 + Math.round(u * 2)],
          (u) => u * 1.3,
        );
        hairline(ex + ox, ey + oy, tx + ox, ty + oy, f.ramp[2], (u) => (u - 0.25) * 1.6);
        if (f.primed) {
          hairline(ex - ox, ey - oy, tx - ox, ty - oy, f.ramp[5], (u) => (u - 0.3) * 1.4);
          glowLine(ex, ey, x, y, BOLT_LOOK.headLight, f.ramp[3], 0.3);
        }
      }
      // the shaft lit along its top and dark under it, the lit side white hot on a primed bolt
      hairline(
        tx,
        ty,
        x - dx,
        y - dy,
        (u) => (f.primed ? f.ramp[5 + Math.round(u)] : f.ramp[3 + Math.round(u * 2)]),
        fade,
      );
      hairline(tx + ox, ty + oy, x - dx + ox, y - dy + oy, f.ramp[f.heavy ? 3 : 2], fade);
      if (f.heavy) hairline(tx - ox, ty - oy, x - dx * 2 - ox, y - dy * 2 - oy, f.ramp[5], fade);
      // the fletching opens and closes as the shaft turns
      const open = stuck >= 0 ? 1 : 0.35 + 0.65 * Math.abs(Math.cos((flown / BOLT_LOOK.spin) * Math.PI));
      const back = BOLT_LOOK.fletch * (f.heavy ? 1.4 : 1);
      const fx = tx - dx * back;
      const fy = ty - dy * back;
      hairline(tx + dx, ty + dy, fx - ox * 2 * back * open, fy - oy * 2 * back * open, f.ramp[5], fade);
      hairline(
        tx + dx + ox,
        ty + dy + oy,
        fx + ox * (1 + 2 * back * open),
        fy + oy * (1 + 2 * back * open),
        f.ramp[3],
        fade,
      );
      // a barbed head: a white point with its two barbs swept back
      hairline(x - dx * 1.5 - ox * 2, y - dy * 1.5 - oy * 2, x, y, f.ramp[5], fade);
      hairline(x - dx * 1.5 + ox * 3, y - dy * 1.5 + oy * 3, x + ox, y + oy, f.ramp[4], fade);
      hairline(x - dx, y - dy, x + dx * 0.5, y + dy * 0.5, WHITE, fade);
      hairline(x - dx + ox, y - dy + oy, x + dx * 0.5 + ox, y + dy * 0.5 + oy, WHITE, fade);
      if (stuck < 0 && (f.primed || f.heavy))
        glow(x, y, f.heavy ? BOLT_LOOK.heavyLight : BOLT_LOOK.headLight, f.ramp[3], 0.4);
    },
  };
}
