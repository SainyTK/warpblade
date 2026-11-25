import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, place, shade } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import { mix } from "../../../../utils/color";
import { grain } from "../../../../utils/grain";
import { clamp, ease } from "../../../../utils/math";
import { FOE } from "../colors";

const LIFE = 1.3;
const SPREAD = { from: 6, to: 16, ring: 22 } as const;

export function createInkSplash(x: number): Effect {
  let age = 0;
  return {
    update(dt) {
      age += dt;
      return age < LIFE;
    },
    drawBack() {
      place();
      const k = clamp(age / LIFE);
      const half = SPREAD.from + (SPREAD.to - SPREAD.from) * ease.outCubic(clamp(age * 5));
      const fade = 1 - k;
      shade(x - half, GROUND - 1, x + half, GROUND + 3, (px, py, out) => {
        const u = (px - x) / half;
        const v = py - GROUND;
        const reach = 1 - u * u;
        if (reach <= 0 || v < -Math.sqrt(reach) || v > 2.5 * Math.sqrt(reach)) return;
        if (grain(Math.floor(px * 2), Math.floor(py * 2)) > fade * 1.4) return;
        out.c = v < -0.4 ? FOE.inkSheen : mix(FOE.ink[2], FOE.ink[0], clamp(v / 2.5));
      });
      if (age < 0.35) {
        const r = SPREAD.ring * ease.outCubic(age / 0.35);
        ellipseRing(x, GROUND, r, r * 0.22, FOE.inkSheen, 1 - age / 0.35);
      }
      for (let i = 0; i < 3; i++) {
        const lx = x + (grain(i, x) - 0.5) * half * 1.4;
        fleck(lx, GROUND + 0.5, FOE.letter, fade * (0.5 + 0.5 * Math.sin(age * 9 + i)));
      }
    },
    draw() {},
  };
}
