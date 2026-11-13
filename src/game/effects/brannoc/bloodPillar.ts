import { PAL, SPARKS } from "../../../constants/palette";
import { glow, place, px } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { grain } from "../../../utils/grain";
import { ease } from "../../../utils/math";
import { lights, particles, rng } from "../../state";

/** seconds the pillar takes to rise, stands, and takes to fall back into the floor */
const RISE = 0.1;
const STAND = 0.12;
const FALL = 0.3;

/**
 * A pillar of blood erupting from the floor: a column `width` across that shoots up to `height`, a ragged pale crown,
 * dark edges and a bright core, then falls back into the floor, throwing drops. It stands behind the heroes and foes so
 * it never hides them. Drawn only; the hit is dealt by whoever raises it. It waits `delay` seconds before it erupts.
 */
export function createBloodPillar(x: number, floor: number, width: number, height: number, delay = 0): Effect {
  let t = -delay;
  let erupted = false;
  const seed = Math.floor(x * 7 + height);
  const half = width / 2;
  const erupt = () => {
    erupted = true;
    lights.add(x, floor - height / 2, height * 0.7, PAL.rage[3], 0.45, RISE + STAND);
    for (let i = 0; i < 10; i++)
      particles.spawn(
        PK.SPARK,
        x + rng.range(-half, half),
        floor - height,
        rng.range(-40, 40),
        -rng.range(40, 120),
        0.4,
        {
          sparks: SPARKS.rage,
        },
      );
  };
  return {
    update(dt) {
      t += dt;
      if (t >= 0 && !erupted) erupt();
      return t < RISE + STAND + FALL;
    },
    draw() {},
    drawBack() {
      if (t < 0) return;
      place();
      const top =
        t < RISE
          ? height * ease.outCubic(t / RISE)
          : t < RISE + STAND
            ? height
            : height * (1 - ((t - RISE - STAND) / FALL) ** 3);
      const k = t < RISE + STAND ? 1 : 1 - (t - RISE - STAND) / FALL;
      // the column narrows as it falls back, its sides wobble, and bright streaks run up through it
      const w = half * (0.5 + 0.5 * k);
      for (let y = 0; y < top; y++) {
        const sway = Math.sin(y * 0.45 + t * 40 + seed) * 0.12 + (y > top - 4 ? 0.25 : 0);
        const rw = w * (1 + sway);
        const streak = grain(Math.floor((y - t * 260) / 3), seed) < 0.25;
        for (let dx = -Math.ceil(rw); dx <= Math.ceil(rw); dx++) {
          const edge = Math.abs(dx) / Math.max(1, rw);
          if (edge > 1) continue;
          const core = edge < 0.2 || (streak && edge < 0.55);
          const c = edge > 0.8 ? PAL.rage[1] : edge > 0.5 ? PAL.rage[2] : core ? PAL.rage[4] : PAL.rage[3];
          px(x + dx, floor - y - 1, c, k);
        }
      }
      // the crown: a ragged pale splash over the top
      for (let dx = -Math.ceil(w * 1.3); dx <= Math.ceil(w * 1.3); dx++) {
        const lift = grain(dx, seed + Math.floor(t * 20)) * 4;
        const edge = Math.abs(dx) / Math.max(1, w * 1.3);
        px(x + dx, floor - top - lift * (1 - edge), edge < 0.5 ? PAL.rage[5] : PAL.rage[4], k * (1 - edge * 0.5));
      }
      glow(x, floor - top * 0.6, Math.max(6, top * 0.5), PAL.rage[3], 0.3 * k);
    },
  };
}
