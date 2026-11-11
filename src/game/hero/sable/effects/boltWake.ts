import { WAKE_LOOK } from "../../../../constants/sable/look";
import { fleck, hairline, place } from "../../../../engine/frame";
import type { Ramp } from "../../../../types/color";
import type { Effect } from "../../../../types/effect";
import { grain } from "../../../../utils/grain";
import { fineRing } from "../../../effects/fine";

export interface Wake {
  x: number;
  y: number;
  /** radians, positive down */
  angle: number;
  /** pixels a second the bolt flies, and how far */
  speed: number;
  range: number;
  ramp: Ramp;
}

/**
 * The wake a heavy bolt tears through the air: a ring punched open at the muzzle, and a line of light from there to the
 * bolt, three image pixels thick behind the head and thinning toward the muzzle, which breaks into dashes and drifts
 * apart once the bolt has gone.
 */
export function createBoltWake(w: Wake): Effect {
  const ux = Math.cos(w.angle);
  const uy = Math.sin(w.angle);
  const flight = w.range / w.speed;
  const life = flight + WAKE_LOOK.linger;
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return t < life;
    },
    draw() {
      place();
      const reach = Math.min(w.range, w.speed * t);
      const age = Math.max(0, t - flight) / WAKE_LOOK.linger;
      const k = 1 - age;
      const drift = age * WAKE_LOOK.drift;
      const hx = w.x + ux * reach;
      const hy = w.y + uy * reach;
      const pieces = Math.ceil(reach / WAKE_LOOK.piece);
      for (let i = 0; i < pieces; i++) {
        // each piece of the line drifts its own way and goes out at its own time
        if (grain(i, w.x) < age * 1.2) continue;
        const a = i * WAKE_LOOK.piece;
        const b = Math.min(reach, a + WAKE_LOOK.piece);
        const lift = (grain(w.x, i) - 0.5) * drift;
        const near = a / Math.max(1, reach);
        const side = lift;
        hairline(
          w.x + ux * a,
          w.y + uy * a + side,
          w.x + ux * b,
          w.y + uy * b + side,
          w.ramp[near > 0.6 ? 5 : 4],
          k * 2,
        );
        if (near > 0.3)
          hairline(
            w.x + ux * a,
            w.y + uy * a + side + 0.5,
            w.x + ux * b,
            w.y + uy * b + side + 0.5,
            w.ramp[3],
            k * 1.4,
          );
        if (near > 0.7)
          hairline(w.x + ux * a, w.y + uy * a + side - 0.5, w.x + ux * b, w.y + uy * b + side - 0.5, w.ramp[6], k * 2);
      }
      // motes thrown off the line, above and below
      for (let i = 0; i < WAKE_LOOK.motes; i++) {
        const at = grain(i, w.y) * reach;
        const off = (grain(w.y, i) - 0.5) * 2 * (2 + age * WAKE_LOOK.drift * 2);
        fleck(w.x + ux * at - uy * off, w.y + uy * at + ux * off, w.ramp[4 + (i % 2)], k * 1.5);
      }
      if (t < WAKE_LOOK.ringLife) {
        const u = t / WAKE_LOOK.ringLife;
        const r = WAKE_LOOK.ring * (0.3 + 0.7 * u);
        // seen edge on, the ring stands across the bolt's line
        fineRing(w.x + ux * 4, w.y + uy * 4, r * 0.35, r, w.ramp[5], (1 - u) * 2);
        fineRing(w.x + ux * 9, w.y + uy * 9, r * 0.25, r * 0.7, w.ramp[4], (1 - u) * 1.4);
      }
      if (age <= 0) fleck(hx, hy, w.ramp[6]);
    },
  };
}
