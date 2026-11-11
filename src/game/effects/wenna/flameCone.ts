import { PAL } from "../../../constants/palette";
import { CONE_LOOK as L } from "../../../constants/wenna/flameLook";
import { glow, hairline, place, shade } from "../../../engine/frame";
import type { Effect } from "../../../types/effect";
import { PK } from "../../../types/particle";
import { grain } from "../../../utils/grain";
import { clamp } from "../../../utils/math";
import { lights, particles, rng } from "../../state";

/** a violet cone of flame from the lamp's shutter: where it starts, its reach, its half angle and how bright */
export interface FlameConeSpec {
  x: number;
  y: number;
  face: number;
  near: number;
  far: number;
  half: number;
  /** 1 for her own Flare, less for a Wick's repeat */
  power: number;
}

/**
 * The cone flares out from the shutter as tongues of violet flame of uneven length, pale only near its root, thin
 * enough that the foes it burns still show through it. Bright streaks run out along it, and as it gutters the tongues
 * shorten, cool down the ramp and break into specks.
 */
export function createFlameCone(c: FlameConeSpec): Effect {
  let t = 0;
  const R = PAL.wick;
  const seed = Math.floor(c.x * 3 + c.y * 7);
  const tall = Math.sin(Math.min(c.half, Math.PI / 2)) * c.far + 2;
  lights.add(c.x + c.face * c.far * 0.5, c.y, c.far * 0.7, R[3], L.light.strength * c.power, L.life + 0.1);
  for (let i = 0; i < Math.round(10 * c.power); i++) {
    const a = rng.range(-c.half, c.half);
    const sp = rng.range(60, 160);
    particles.spawn(PK.SPARK, c.x, c.y, Math.cos(a) * sp * c.face, Math.sin(a) * sp, rng.range(0.2, 0.4), {
      col: rng.chance(0.5) ? R[4] : R[5],
    });
  }
  return {
    update(dt) {
      t += dt;
      return t < L.life;
    },
    draw() {
      place();
      const u = t / L.life;
      const reach = c.near + (c.far - c.near) * Math.min(1, u * 3);
      const fade = 1 - u;
      const x0 = c.face > 0 ? c.x : c.x - reach - 1;
      shade(
        x0,
        c.y - tall,
        x0 + reach + 1,
        c.y + tall,
        (x, y, out) => {
          const dx = (x - c.x) * c.face;
          const dy = y - c.y;
          if (dx <= 0) return;
          const d = Math.hypot(dx, dy);
          if (d > reach) return;
          const a = Math.atan2(dy, dx);
          const edge = c.half * (0.4 + 0.6 * Math.min(1, d / Math.max(1, c.far * 0.4)));
          if (Math.abs(a) > edge) return;
          // each tongue across the cone has its own length, and flickers
          const across = (a / edge) * 0.5 + 0.5;
          const tongue = Math.floor(across * L.tongues);
          const inTongue = Math.abs(((across * L.tongues) % 1) - 0.5) * 2;
          const long = L.shortest + (1 - L.shortest) * grain(tongue, seed + Math.floor(t * 40));
          const end = reach * long * (1 - inTongue * inTongue * 0.35);
          if (d > end) return;
          const along = d / end;
          const q = Math.max(Math.abs(a) / edge, along);
          if (u > 0.35 && grain(Math.floor(x * 2), Math.floor(y * 2) + seed) < (u - 0.35) * 1.5 * (0.4 + q)) return;
          const hot = d < c.far * L.hot * fade && Math.abs(a) < edge * 0.5;
          out.c = hot ? R[5] : R[clamp(Math.round(4.1 - q * 2.4 - u * 1.6), 1, 4)];
          out.a = (L.rimAlpha + (L.rootAlpha - L.rimAlpha) * (1 - q)) * c.power * Math.min(1, fade * 2);
        },
        { soft: true },
      );
      for (let i = 0; i < L.streaks; i++) {
        const a = (grain(i, seed) * 2 - 1) * c.half * 0.8;
        const head = reach * (0.35 + 0.65 * grain(i, seed + 3)) * Math.min(1, u * 2.5 + 0.2);
        const tail = head * (0.45 + u * 0.5);
        const cx = Math.cos(a) * c.face;
        const sy = Math.sin(a);
        hairline(c.x + cx * tail, c.y + sy * tail, c.x + cx * head, c.y + sy * head, u < 0.4 ? R[5] : R[4], fade * 1.5);
      }
      glow(c.x + c.face * reach * 0.4, c.y, reach * 0.5, R[3], L.light.glow * fade * c.power);
    },
  };
}
