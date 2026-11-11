import { GROUND } from "../../../constants/stage";
import { circle, ellipseRing, glow, glowLine, hairline, line, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { Rng } from "../../../utils/rng";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { game, particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { STORM_SPARKS, STORM_VOLT as V } from "./colors";

/** half the width of the strip a kite's bolt strikes */
export const BOLT_HALF = 6;
const LIFE = 0.28;
/** the bolt hurts only in its first instant, so a late dash through the fading light is safe */
const LIVE = 0.08;
/** seconds the bolt's fine forks and the white burst at its foot show */
const FORK_LIFE = 0.09;

/** a violet column on the floor under a winding kite, filling as its strike nears; gone once the kite strikes */
export function createStormMark(e: Enemy, windup: number): Effect {
  let t = 0;
  const live = () => e.state === "wind" && e.hp > 0 && e.stun <= 0 && !e.air;
  const draw = (half: number) => {
    place();
    const u = clamp(t / windup);
    const r = BOLT_HALF + (1 - u) * 6;
    ellipseRing(e.ax, GROUND, r, r * 0.24, V[u > 0.7 ? 4 : 3], 0.6 + u * 0.4, half);
    ellipseRing(e.ax, GROUND, r - 2, (r - 2) * 0.24, V[2], 0.5, half);
    if (half > 0) {
      glow(e.ax, GROUND - 2, BOLT_HALF * 2.5, V[3], 0.2 + u * 0.25);
      // the strip it will strike fills in from the middle as the charge gathers
      hairline(e.ax - BOLT_HALF * u, GROUND + 0.25, e.ax + BOLT_HALF * u, GROUND + 0.25, V[4], 0.9);
    }
  };
  return {
    update(dt) {
      t += dt;
      return live();
    },
    drawBack() {
      draw(-1);
      // a faint dashed guide from the kite down to where the bolt will land
      const u = clamp(t / windup);
      for (let y = e.y + 8; y < GROUND - 2; y += 4) if ((y + game.t * 30) % 8 < 4) px(e.ax, y, V[3], 0.3 + u * 0.4);
    },
    draw: () => draw(1),
  };
}

/** a violet bolt from the kite straight down to the floor; it hurts Kael once if he stands in its strip */
export function createStormBolt(x: number, y: number, damage: number): Effect {
  let t = 0;
  const bit = new Set<number>();
  const R = new Rng(Math.floor(x * 31 + y * 7 + rng.next() * 1000));
  const pts: [number, number][] = [[x, y]];
  for (let py = y + 6; py < GROUND; py += 6) pts.push([x + R.range(-3, 3), py]);
  pts.push([x, GROUND]);
  for (let i = 0; i < 8; i++)
    particles.spawn(PK.SPARK, x + rng.range(-3, 3), GROUND - 1, rng.range(-90, 90), -rng.range(50, 140), 0.3, {
      sparks: STORM_SPARKS,
    });
  return {
    update(dt) {
      t += dt;
      eachStanding(() => {
        if (bit.has(heroSlot()) || t >= LIVE || !boxHit([x - BOLT_HALF, y, x + BOLT_HALF, GROUND], heroBox())) return;
        bit.add(heroSlot());
        hurtHero(damage, x);
      });
      return t < LIFE;
    },
    draw() {
      place();
      const f = 1 - t / LIFE;
      const flick = t > 0.05 && t < 0.09 ? 0.35 : 1;
      for (let i = 1; i < pts.length; i++) {
        const [ax, ay] = pts[i - 1];
        const [bx, by] = pts[i];
        line(ax - 1, ay, bx - 1, by, V[2], 0.7 * f * flick);
        line(ax + 1, ay, bx + 1, by, V[2], 0.7 * f * flick);
        line(ax, ay, bx, by, t < 0.06 ? WHITE : V[4], f * flick);
        hairline(ax + 0.25, ay, bx + 0.25, by, WHITE, f * flick);
        // a fine fork springs off every other bend, away from the bolt's line
        if (i % 2 === 0 || t > FORK_LIFE) continue;
        const side = ax < x ? -1 : 1;
        hairline(ax, ay, ax + side * 4, ay + 3, V[4], flick);
        hairline(ax + side * 4, ay + 3, ax + side * 5.5, ay + 7, V[3], flick);
      }
      // where it strikes: a white heart and rays along the floor
      if (t < FORK_LIFE) {
        circle(x, GROUND - 1, 2.2, WHITE);
        for (const side of [-1, 1]) {
          hairline(x, GROUND - 0.5, x + side * 9, GROUND - 0.5, V[4]);
          hairline(x, GROUND - 1, x + side * 6, GROUND - 5, V[4]);
        }
      }
      glowLine(x, y, x, GROUND, 10, V[3], 0.45 * f);
      glow(x, GROUND, 18, V[3], 0.5 * f);
      ellipseRing(x, GROUND, BOLT_HALF + t * 60, (BOLT_HALF + t * 60) * 0.24, V[3], f);
    },
  };
}
