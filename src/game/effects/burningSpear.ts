import { EMBER } from "../../constants/characters/ysra/look";
import { fleck, glowLine, hairline, line, place, polygon } from "../../engine/frame";
import type { Effect } from "../../types/effect";
import { PF, PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { particles, rng } from "../state";

const SHAFT = 26;
const HEAD = 7;
/** how long the burning streak it leaves takes to fade */
const WAKE = 0.5;

export interface SpearFlight {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  speed: number;
  delay: number;
  /** the stretch it flew this frame, for what it pierces */
  pass(ax: number, ay: number, bx: number, by: number): void;
  /** it reached (x1, y1) */
  end(x: number, y: number): void;
}

/** a spear of forge-fire flying from (x0, y0) to (x1, y1), leaving a burning streak along its path */
export function createBurningSpear(f: SpearFlight): Effect {
  const len = Math.hypot(f.x1 - f.x0, f.y1 - f.y0) || 1;
  const ux = (f.x1 - f.x0) / len;
  const uy = (f.y1 - f.y0) / len;
  let t = -f.delay;
  let d = 0;
  let after = 0;
  const at = (s: number): [number, number] => [f.x0 + ux * s, f.y0 + uy * s];
  return {
    update(dt) {
      t += dt;
      if (t < 0) return true;
      if (d >= len) {
        after += dt;
        return after < WAKE;
      }
      const from = d;
      d = Math.min(len, d + f.speed * dt);
      const [ax, ay] = at(from);
      const [bx, by] = at(d);
      f.pass(ax, ay, bx, by);
      for (let i = 0; i < 4; i++) {
        const [px0, py0] = at(d - rng.range(4, SHAFT));
        particles.spawn(
          PK.FIRE,
          px0,
          py0 + rng.range(-1, 1),
          -ux * rng.range(20, 60),
          -uy * 40 - rng.range(10, 40),
          rng.range(0.15, 0.35),
          {
            col: 0,
            size: rng.range(1.2, 2.4),
            flag: rng.chance(0.15) ? PF.SMOKES : 0,
          },
        );
      }
      if (rng.chance(0.4)) particles.spawn(PK.EMBER, bx, by, -ux * 40 + rng.range(-20, 20), -rng.range(20, 60), 0.8);
      if (d >= len) f.end(f.x1, f.y1);
      return true;
    },
    draw() {
      if (t < 0) return;
      place();
      const fade = 1 - after / WAKE;
      const [tx, ty] = at(d);
      // the streak fades from where it was thrown toward where it landed
      const [sx, sy] = at(d * (after / WAKE));
      // the streak: an ember thread with a hotter seam, breaking up as it cools
      hairline(sx, sy, tx, ty, EMBER[4], (u) => fade * (0.4 + 0.6 * u));
      hairline(sx, sy + 0.5, tx, ty + 0.5, EMBER[3], fade * 0.9);
      hairline(sx, sy + 1, tx, ty + 1, EMBER[2], fade * 0.5);
      glowLine(sx, sy, tx, ty, 6, EMBER[3], 0.35 * fade);
      if (after > 0) return;
      const nx = -uy;
      const ny = ux;
      const [bx, by] = at(d - SHAFT);
      const [hx, hy] = at(d - HEAD);
      line(bx, by, hx, hy, (u) => EMBER[2 + Math.round(u * 2)]);
      hairline(bx + nx * 0.75, by + ny * 0.75, hx + nx * 0.75, hy + ny * 0.75, (u) => EMBER[1 + Math.round(u * 2)]);
      hairline(bx - nx * 0.25, by - ny * 0.25, hx - nx * 0.25, hy - ny * 0.25, (u) => EMBER[4 + Math.round(u)]);
      polygon(
        [
          [tx, ty],
          [hx + nx * 2.5, hy + ny * 2.5],
          [hx - nx * 2.5 + ux, hy - ny * 2.5 + uy],
        ],
        EMBER[5],
      );
      // the head: a dark red underside, a white ridge to the point
      polygon(
        [
          [tx, ty],
          [hx - nx * 2.5 + ux, hy - ny * 2.5 + uy],
          [hx, hy],
        ],
        EMBER[3],
      );
      hairline(hx, hy, tx, ty, WHITE);
      fleck(tx, ty, WHITE);
      glowLine(bx, by, tx, ty, 10, EMBER[4], 0.55);
    },
  };
}
