import { BOLT } from "../../constants/sable/bolt";
import { W } from "../../constants/stage";
import { glow, glowLine, line, place, px } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { lights, particles, rng } from "../state";
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

/** how far behind the head the fading trail reaches */
const TRAIL = 26;

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
    lights.add(x, y, 14, f.ramp[4], 0.6, 0.12);
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
      const tx = x - ux * shaft;
      const ty = y - uy * shaft;
      if (stuck < 0) {
        const [ox, oy] = trail[0];
        const reach = Math.min(TRAIL, Math.hypot(x - ox, y - oy));
        line(
          x - ux * reach,
          y - uy * reach,
          tx,
          ty,
          (u) => f.ramp[1 + Math.round(u * 2)],
          (u) => u * 0.8,
        );
        glowLine(x - ux * reach, y - uy * reach, x, y, f.primed ? 7 : 4, f.ramp[f.primed ? 5 : 3], 0.3);
      }
      // the shaft dark to light, then fletching at the tail and a white head
      line(tx, ty, x - ux * 2, y - uy * 2, (u) => f.ramp[2 + Math.round(u * 2)], fade);
      px(tx - uy, ty + ux, f.ramp[3], fade);
      px(tx + uy, ty - ux, f.ramp[2], fade);
      px(x - ux, y - uy, f.ramp[5], fade);
      px(x, y, WHITE, fade);
      if (stuck < 0) glow(x, y, f.heavy ? 10 : f.primed ? 6 : 3.5, f.primed ? WHITE : f.ramp[4], 0.45);
    },
  };
}
