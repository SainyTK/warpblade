import { glow, hairline, place } from "../../../../engine/frame";
import { fxRng, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import { PK } from "../../../../types/particle";
import { clamp, TAU } from "../../../../utils/math";
import { SKY_SPARKS } from "../colors";
import { WARDEN } from "./colors";

const BURST = { life: 0.32, rays: 11 } as const;

export function createLanternFlash(x: number, y: number, radius: number): Effect {
  let t = 0;
  const bends = Array.from({ length: BURST.rays }, () => fxRng.range(-0.2, 0.2));
  for (let i = 0; i < 16; i++) {
    const a = fxRng.range(0, TAU);
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * 140, Math.sin(a) * 140, fxRng.range(0.2, 0.35), {
      sparks: SKY_SPARKS.volt,
    });
  }
  return {
    update(dt) {
      t += dt;
      return t < BURST.life;
    },
    draw() {
      place();
      const u = clamp(t / 0.1);
      const fade = 1 - clamp(t / BURST.life);
      for (let i = 0; i < BURST.rays; i++) {
        const a = (i / BURST.rays) * TAU + bends[i];
        const len = radius * u * (0.75 + (i % 3) * 0.15);
        const mx = x + Math.cos(a + 0.12) * len * 0.5;
        const my = y + Math.sin(a + 0.12) * len * 0.5;
        hairline(x, y, mx, my, WARDEN.light[4], fade);
        hairline(mx, my, x + Math.cos(a) * len, y + Math.sin(a) * len, i % 2 ? WARDEN.light[4] : WARDEN.light[3], fade);
      }
      glow(x, y, radius * 1.1, WARDEN.light[2], 0.55 * fade);
      glow(x, y, 8, WARDEN.light[4], 0.8 * fade);
    },
  };
}
