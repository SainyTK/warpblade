import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, hairline, line, place, polygon, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { eachStanding, heroSlot } from "../../coopHooks";
import { hurtHero } from "../../hurtHero";
import { particles, rng } from "../../state";
import { boxHit, heroBox } from "../../world";
import { AC, VOID, VOID_SPARKS } from "./colors";

/** each spike: a glowing crack first, then the spike bursts up, holds and sinks */
const SPIKE = { warn: 0.42, up: 0.06, hold: 0.16, down: 0.14 } as const;
const GAP = 20;
const DELAY = 0.09;
const HEIGHT = 17;
/** half a spike's width at the floor, in art pixels */
const SPIKE_HALF = 4.5;

/** the crack that warns of a spike: it splits wider and burns brighter as k runs from 0 to 1, shedding motes of light */
function drawCrack(x: number, k: number, index: number): void {
  const half = Math.round(2 + k * 4);
  const lit = k > 0.7 ? VOID[4] : VOID[3];
  line(x - half, GROUND, x + half, GROUND, VOID[2], 0.5 + k * 0.5);
  // the split itself is a fine jagged seam, white at its middle once it is about to burst
  for (let d = -half; d < half; d++) {
    const y0 = GROUND + (((d + index) & 1) === 0 ? 0.25 : 0.75);
    const y1 = GROUND + (((d + index) & 1) === 0 ? 0.75 : 0.25);
    hairline(x + d, y0, x + d + 1, y1, Math.abs(d) < half * 0.5 && k > 0.5 ? VOID[5] : lit);
  }
  px(x, GROUND - 1, VOID[5], k);
  for (let m = 0; m < 3; m++) {
    const lift = (k * 2.2 + m * 0.37) % 1;
    fleck(x + (m - 1) * 2.5 * k, GROUND - 1 - lift * (4 + k * 6), VOID[4], (1 - lift) * k);
  }
  glow(x, GROUND - 2, 8 + k * 6, VOID[3], 0.25 + k * 0.35);
}

/** one spike h art pixels high: a dark crystal with a lit face, a white ridge and a splinter at its foot */
function drawSpike(x: number, h: number, lean: number): void {
  const w = SPIKE_HALF;
  const tip = [x + lean, GROUND - h] as const;
  const ridge = x + lean * 0.5 + 0.5;
  polygon([[x - w, GROUND + 1], tip, [x + w, GROUND + 1]], AC.outline);
  if (h > 5) {
    polygon(
      [
        [x + w - 1.5, GROUND + 1],
        [x + w + 1.5, GROUND - h * 0.4],
        [x + w + 2.5, GROUND + 1],
      ],
      AC.outline,
    );
    polygon(
      [
        [x + w - 0.5, GROUND + 1],
        [x + w + 1.5, GROUND - h * 0.4 + 1.5],
        [x + w + 1.8, GROUND + 1],
      ],
      VOID[2],
    );
  }
  const inner = [tip[0], tip[1] + 1.2] as const;
  polygon([[x - w + 1, GROUND + 1], inner, [ridge, GROUND + 1]], VOID[3]);
  polygon([[ridge, GROUND + 1], inner, [x + w - 1, GROUND + 1]], VOID[1]);
  hairline(x - w + 1.5, GROUND + 0.5, inner[0] - 0.4, inner[1] + 1.5, VOID[4]);
  hairline(ridge, GROUND, inner[0], inner[1] + 0.5, VOID[5]);
  fleck(inner[0], inner[1], WHITE);
  line(x - w + 1, GROUND, x + w - 1, GROUND, VOID[4], 0.6);
  glow(x, GROUND - h * 0.5, 12, VOID[3], 0.45 * (h / HEIGHT));
}

/**
 * The Abyss Maw's slam: a row of cracks races along the floor away from it and void spikes burst out of each one in
 * turn. Each crack glows before its spike comes, so Kael can jump the row or dash through it. The row hits once.
 */
export function createVoidSpikes(x0: number, dir: number, count: number, damage: number): Effect {
  const xs = Array.from({ length: count }, (_, i) => x0 + dir * i * GAP).filter((x) => x > 4 && x < W - 4);
  const life = (xs.length - 1) * DELAY + SPIKE.warn + SPIKE.up + SPIKE.hold + SPIKE.down;
  let t = 0;
  const hit = new Set<number>();
  /** the spike's height from 0 to 1 at its own time u, which is negative before its crack opens */
  const rise = (u: number): number => {
    const v = u - SPIKE.warn;
    if (v < 0) return 0;
    if (v < SPIKE.up) return v / SPIKE.up;
    if (v < SPIKE.up + SPIKE.hold) return 1;
    return 1 - clamp((v - SPIKE.up - SPIKE.hold) / SPIKE.down);
  };
  return {
    update(dt) {
      const before = t;
      t += dt;
      xs.forEach((x, i) => {
        const u = t - i * DELAY;
        const was = before - i * DELAY;
        if (u >= SPIKE.warn && was < SPIKE.warn) {
          for (let k = 0; k < 4; k++)
            particles.spawn(PK.SPARK, x + rng.range(-3, 3), GROUND - 1, rng.range(-40, 40), rng.range(-160, -60), 0.3, {
              sparks: VOID_SPARKS,
            });
          if (i % 2 === 0) sfx.swing(0.3);
        }
        const h = rise(u) * HEIGHT;
        eachStanding(() => {
          if (
            hit.has(heroSlot()) ||
            h <= 4 ||
            u >= SPIKE.warn + SPIKE.up + SPIKE.hold ||
            !boxHit([x - 4, GROUND - h, x + 4, GROUND], heroBox())
          )
            return;
          hit.add(heroSlot());
          hurtHero(damage, x - dir * 8);
        });
      });
      return t < life;
    },
    draw() {
      place();
      xs.forEach((x, i) => {
        const u = t - i * DELAY;
        if (u < 0) return;
        if (u < SPIKE.warn) {
          drawCrack(x, u / SPIKE.warn, i);
          return;
        }
        const h = rise(u) * HEIGHT;
        if (h >= 1) drawSpike(x, h, ((i % 3) - 1) * 1.5);
      });
    },
  };
}
