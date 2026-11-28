import { fleck, glowLine, place } from "../../../../engine/frame";
import type { Effect } from "../../../../types/effect";
import { clamp } from "../../../../utils/math";
import { FOE } from "../colors";
import { HUSHWARDEN } from "./moves";
import { SWING_HAND } from "./pose";

const LIFE = 0.35;

export function createSweepTrail(x: number, y: number, face: number): Effect {
  let age = 0;
  const { from, to, radius } = HUSHWARDEN.arc;
  return {
    update(dt) {
      age += dt;
      return age < LIFE;
    },
    draw() {
      place();
      const fade = 1 - clamp(age / LIFE);
      const n = 18;
      let last: [number, number] | null = null;
      for (let i = 0; i <= n; i++) {
        const a = from + ((to - from) * i) / n;
        const px = x + face * (SWING_HAND[0] + Math.cos(a) * radius);
        const py = y + SWING_HAND[1] + Math.sin(a) * radius;
        if (last) glowLine(last[0], last[1], px, py, 3, FOE.ink[3], 0.35 * fade * (i / n));
        fleck(px, py, i % 3 ? FOE.inkSheen : FOE.letterHot, fade * (i / n));
        last = [px, py];
      }
    },
  };
}
