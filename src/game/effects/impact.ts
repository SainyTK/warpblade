import { circle, fleck, place } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { PK } from "../../types/particle";
import { WHITE } from "../../utils/color";
import { ease, TAU } from "../../utils/math";
import { skin } from "../hero/skin";
import { lights, particles, rng } from "../state";
import { fineRing, ray } from "./fine";

/** seconds the star takes to open, and how long the whole hit shows, plain and big */
const OPEN = 0.03;
const LIFE = 0.13;
const BIG_LIFE = 0.18;
/** rays along the blow reach this much further than rays against it */
const FORWARD_REACH = 0.7;
/** the ring is gone this far through the hit, before the rays */
const RING_UNTIL = 0.65;

/**
 * a hit: a small white core, a star of thin rays thrown along the blow that leave the core as they age, a ring that
 * opens and breaks up, sparks thrown forward and a light that flares and dies; the hero's own sparks unless given
 */
export function createImpact(x: number, y: number, dir: number, big: boolean, sparks: Ramp = skin.sparks): Effect {
  const R = rng;
  const count = big ? 7 : 5;
  const spikes = Array.from({ length: count }, (_, i) => ({
    a: (i / count) * TAU + R.range(-0.3, 0.3) + (dir < 0 ? Math.PI : 0),
    len: R.range(5, big ? 13 : 9),
  }));
  lights.add(x, y, big ? 34 : 24, sparks[2], big ? 0.55 : 0.4, big ? 0.26 : 0.16);
  lights.add(x, y, 9, WHITE, 0.5, 0.08);
  for (let i = 0; i < (big ? 14 : 8); i++) {
    const a = (dir > 0 ? 0 : Math.PI) + R.range(-1.1, 1.1);
    const sp = R.range(120, big ? 380 : 280);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * sp, Math.sin(a) * sp - 40, R.range(0.12, 0.35), { sparks });
  }
  const life = big ? BIG_LIFE : LIFE;
  const forward = dir < 0 ? Math.PI : 0;
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      const u = t / life;
      const f = 1 - u;
      const open = ease.outCubic(Math.min(1, t / OPEN));
      for (const s of spikes) {
        const reach = s.len * (1 + FORWARD_REACH * Math.max(0, Math.cos(s.a - forward)));
        const tip = reach * open;
        // the ray leaves the core and shortens toward its tip, so the star opens up as it dies
        ray(x, y, s.a, tip * u * 0.9, tip, WHITE, sparks[1], f * 1.6);
        fleck(x + Math.cos(s.a) * (tip + 1.5), y + Math.sin(s.a) * (tip + 1.5), sparks[2], f * 2);
      }
      const ring = (big ? 9 : 6) * ease.outCubic(u) + 1.5;
      if (u < RING_UNTIL) fineRing(x, y, ring, ring, sparks[2], (1 - u / RING_UNTIL) * 1.4);
      if (u < 0.6) {
        const core = (big ? 2.4 : 1.8) * (1 - u / 0.6) + 0.5;
        circle(x, y, core + 0.5, sparks[1]);
        circle(x, y, core, WHITE);
      }
    },
  };
}
