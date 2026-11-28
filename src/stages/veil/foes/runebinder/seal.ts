import { GROUND } from "../../../../constants/stage";
import { ellipseRing, glow, glowLine, hairline, place, px } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { boxHit, heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { WHITE } from "../../../../utils/color";
import { clamp, ease, TAU } from "../../../../utils/math";
import { sparkBurst } from "../burst";
import { RUNE_SPARKS, VEIL } from "../colors";
import { BINDER } from "./constants";

const R = VEIL.rune;
const BLAST = 0.36;
const GLYPHS = [
  ["#.#", ".#.", "#.#"],
  ["##.", "#.#", ".##"],
  [".#.", "###", ".#."],
] as const;

export function createRuneSeal(x: number, mark: number, damage: number): Effect {
  let t = 0;
  let burst = false;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      if (t < mark) return true;
      if (!burst) {
        burst = true;
        sfx.boom();
        sparkBurst(x, GROUND - 4, 16, RUNE_SPARKS, 100);
      }
      if (t < mark + BLAST * 0.5)
        eachStanding(() => {
          if (struck.has(heroSlot())) return;
          if (!boxHit([x - BINDER.radius, GROUND - 30, x + BINDER.radius, GROUND], heroBox())) return;
          struck.add(heroSlot());
          hurtHero(damage, x);
        });
      return t < mark + BLAST;
    },
    draw() {
      place();
      const r = BINDER.radius;
      if (t < mark) {
        const k = clamp(t / mark);
        ellipseRing(x, GROUND - 0.5, r, 3, R[1 + Math.round(k * 2)], 0.5 + 0.5 * k);
        ellipseRing(x, GROUND - 0.5, r * (1 - k * 0.6), 3 * (1 - k * 0.6), R[3], 0.3 + 0.7 * k);
        for (let i = 0; i < 6; i++) {
          const a = (i / 6) * TAU + t * 2.5;
          const gx = Math.round(x + Math.cos(a) * r * 0.75) - 1;
          const gy = Math.round(GROUND - 1.5 + Math.sin(a) * 2.2 - k * 3) - 1;
          const g = GLYPHS[i % GLYPHS.length];
          g.forEach((row, j) => {
            for (let c = 0; c < 3; c++)
              if (row[c] === "#") px(gx + c, gy + j - 2, k > 0.7 ? R[4] : R[3], 0.4 + 0.6 * k);
          });
        }
        glow(x, GROUND - 2, r + 4, R[2], 0.2 + 0.3 * k);
        return;
      }
      const u = clamp((t - mark) / BLAST);
      const rise = ease.outExpo(clamp(u * 3));
      const fade = 1 - u;
      for (let i = -3; i <= 3; i++) {
        const bx = x + i * (r / 3.5);
        const h = (26 - Math.abs(i) * 5) * rise;
        hairline(bx, GROUND, bx + i * 0.6, GROUND - h, i % 2 ? R[3] : WHITE, fade);
        hairline(bx + 0.5, GROUND, bx + i * 0.6 + 0.5, GROUND - h * 0.8, R[2], fade);
      }
      ellipseRing(x, GROUND - 0.5, r * (1 + u * 0.4), 3.5, R[4], fade);
      glowLine(x - r, GROUND - 2, x + r, GROUND - 2, 10, R[3], 0.6 * fade);
      glow(x, GROUND - 10, 26, R[2], 0.5 * fade);
    },
  };
}
