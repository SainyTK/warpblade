import { GROUND } from "../../../../constants/stage";
import { ellipseRing, fleck, glow, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { heroBox } from "../../../../game/world";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import { clamp, smooth, TAU } from "../../../../utils/math";
import { BLIGHT } from "../../colors";
import { drawVine } from "./drawVine";
import { SWEEP_REACH } from "./moves";

const INNER = 14;
const TURNS = 1.5;
const SAMPLES = 10;
const PAD = 2;

export function createVineSweep(
  cx: number,
  cy: number,
  dir: number,
  delay: number,
  spin: number,
  damage: number,
): Effect {
  const ry = GROUND - cy;
  const struck = new Set<number>();
  let t = 0;
  let started = false;
  const angle = (): number => Math.PI / 2 + dir * TAU * TURNS * smooth(0, 1, clamp((t - delay) / spin));
  const armEnd = (a: number, r: number): [number, number] => [
    cx + Math.cos(a) * r,
    cy + Math.sin(a) * r * (ry / SWEEP_REACH),
  ];
  return {
    update(dt) {
      t += dt;
      if (t < delay) return true;
      if (!started) {
        started = true;
        sfx.swing(1);
      }
      const base = angle();
      eachStanding(() => {
        const slot = heroSlot();
        if (struck.has(slot)) return;
        const [x0, y0, x1, y1] = heroBox();
        for (const a of [base, base + Math.PI])
          for (let i = 0; i <= SAMPLES; i++) {
            const [px, py] = armEnd(a, INNER + ((SWEEP_REACH - INNER) * i) / SAMPLES);
            if (px > x0 - PAD && px < x1 + PAD && py > y0 - PAD && py < y1 + PAD) {
              struck.add(slot);
              hurtHero(damage, cx);
              return;
            }
          }
      });
      return t < delay + spin;
    },
    drawBack() {
      place();
      const warn = clamp(t / delay);
      const fade = t < delay ? 0.25 + 0.55 * warn : 0.4 * (1 - clamp((t - delay) / spin));
      if (fade <= 0.02) return;
      const blink = t < delay && warn > 0.7 && Math.sin(t * 30) > 0;
      ellipseRing(cx, cy, SWEEP_REACH, ry, blink ? BLIGHT.markHot : BLIGHT.mark, fade * 0.6);
      for (let i = 0; i < 24; i++) {
        const a = (i / 24) * TAU + t * 0.8;
        const [x, y] = armEnd(a, SWEEP_REACH);
        fleck(x, y, BLIGHT.markHot, fade);
      }
      glow(cx, GROUND, SWEEP_REACH, BLIGHT.mark, 0.06 * fade);
    },
    draw() {
      if (t < delay) return;
      place();
      const base = angle();
      for (const a of [base, base + Math.PI]) {
        const [x1, y1] = armEnd(a, SWEEP_REACH);
        const [x0, y0] = armEnd(a, INNER);
        drawVine({ x0, y0, x1, y1, bend: -dir * 6, r0: 2.8, r1: 1.3 }, 1, 0.8);
        glow(x1, y1, 8, BLIGHT.spore[2], 0.4);
      }
    },
  };
}
