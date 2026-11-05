import { GROUND, W } from "../../../constants/stage";
import { glow, line, place, polygon, px } from "../../../engine/frame";
import { sfx } from "../../../services/audio";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
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
          // the crack opens and brightens
          const k = u / SPIKE.warn;
          const half = Math.round(2 + k * 4);
          line(x - half, GROUND, x + half, GROUND, k > 0.7 ? VOID[4] : VOID[3], 0.5 + k * 0.5);
          px(x, GROUND - 1, VOID[5], k);
          glow(x, GROUND - 2, 8 + k * 6, VOID[3], 0.25 + k * 0.35);
          return;
        }
        const h = rise(u) * HEIGHT;
        if (h < 1) return;
        const w = 4.5;
        const lean = ((i % 3) - 1) * 1.5;
        polygon(
          [
            [x - w, GROUND + 1],
            [x + lean, GROUND - h],
            [x + w, GROUND + 1],
          ],
          AC.outline,
        );
        polygon(
          [
            [x - w + 1, GROUND + 1],
            [x + lean, GROUND - h + 1],
            [x + w - 1, GROUND + 1],
          ],
          VOID[2],
        );
        line(x + lean * 0.5 - 1, GROUND, x + lean, GROUND - h + 2, VOID[4]);
        px(x + lean, GROUND - h + 1, VOID[5]);
        glow(x, GROUND - h * 0.5, 12, VOID[3], 0.45 * (h / HEIGHT));
      });
    },
  };
}
