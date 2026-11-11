import { STAKE_LOOK } from "../../../../../constants/ysra/fireLook";
import { fleck, glow, hairline, place, polygon } from "../../../../../engine/frame";
import type { Effect } from "../../../../../types/effect";
import { PK } from "../../../../../types/particle";
import { WHITE } from "../../../../../utils/color";
import { particles, rng } from "../../../../state";
import { dust } from "../../../../world";
import { skin } from "../../../skin";
import { drawTongue } from "../../art/flame";

/** seconds the row stands, and the part of it spent bursting up out of the floor */
const LIFE = 1.1;
const RISE = 0.12;
/** pixels between stakes */
const GAP = 14;

/**
 * Pillory: a row of burning stakes bursting slantwise out of the floor along `length` pixels ahead, one after another
 * from the glaive's point outward, smouldering and sinking back as the row fades.
 */
export function createStakes(x: number, y: number, dir: number, length: number): Effect {
  const count = Math.max(1, Math.floor(length / GAP));
  const stakes = Array.from({ length: count }, (_, i) => ({
    x: x + dir * (i * GAP + rng.range(2, 8)),
    tall: rng.range(13, 19),
    lean: rng.range(2, 4),
    delay: i * 0.035,
  }));
  for (const s of stakes) dust(s.x, y, 3, dir);
  let t = 0;
  return {
    update(dt) {
      t += dt;
      for (const s of stakes)
        if (rng.chance(0.15) && t > s.delay)
          particles.spawn(PK.EMBER, s.x, y - rng.range(2, s.tall), rng.range(-10, 10), -rng.range(20, 50), 0.6);
      return t < LIFE;
    },
    draw() {
      place();
      const R = skin.ramp;
      for (const s of stakes) {
        const u = Math.min(1, Math.max(0, (t - s.delay) / RISE));
        if (u <= 0) continue;
        const fade = Math.min(1, (LIFE - t) / 0.3);
        const h = s.tall * u * fade;
        const top = [s.x + dir * s.lean * u, y - h] as const;
        // a charred stake, glowing along the edge that faces the way it burst, with a flame at its point
        polygon(
          [
            [s.x - STAKE_LOOK.half, y],
            [s.x + STAKE_LOOK.half, y],
            [top[0], top[1]],
          ],
          R[1],
        );
        hairline(s.x - dir * STAKE_LOOK.half, y, top[0], top[1], R[0]);
        hairline(s.x + dir * STAKE_LOOK.half, y, top[0], top[1], (k) => R[k > 0.6 ? 5 : 4]);
        hairline(s.x, y, top[0], top[1], (k) => R[k > 0.5 ? 4 : 2], 0.6);
        const flame = STAKE_LOOK.flame * fade * (0.6 + 0.4 * Math.abs(Math.sin(t * 17 + s.x)));
        drawTongue(top[0], top[1] + 1, flame, dir * 1.2, R);
        fleck(top[0], top[1], t - s.delay < 0.15 ? WHITE : R[6]);
        glow(top[0], top[1] + 2, 6, R[4], 0.4 * fade);
      }
    },
  };
}
