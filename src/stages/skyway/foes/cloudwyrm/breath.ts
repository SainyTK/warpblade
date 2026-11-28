import { glow, glowLine, hairline, line, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { fxRng, particles } from "../../../../game/state";
import { boxHit, heroBox } from "../../../../game/world";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { SKY_SPARKS } from "../colors";
import { WYRM } from "./colors";
import { BREATH } from "./constants";

export const mouthOf = (e: Enemy): [number, number] => [e.x + e.face * 9, e.y + 1];

export function breathHits(x: number, y: number, angle: number): boolean {
  const hb = heroBox();
  for (let d = 0; d <= BREATH.reach; d += 4) {
    const px = x + Math.cos(angle) * d;
    const py = y + Math.sin(angle) * d;
    if (boxHit([px - BREATH.width, py - BREATH.width, px + BREATH.width, py + BREATH.width], hb)) return true;
  }
  return false;
}

export function createBreath(e: Enemy, angle: number, damage: number): Effect {
  let t = 0;
  const struck = new Set<number>();
  const kinks = Array.from({ length: 12 }, () => fxRng.range(-2.5, 2.5));
  return {
    update(dt) {
      t += dt;
      const [x, y] = mouthOf(e);
      if (t < BREATH.live)
        eachStanding(() => {
          if (struck.has(heroSlot()) || !breathHits(x, y, angle)) return;
          struck.add(heroSlot());
          hurtHero(damage, x);
        });
      if (fxRng.chance(0.6)) {
        const d = fxRng.range(10, BREATH.reach);
        particles.spawn(PK.SPARK, x + Math.cos(angle) * d, y + Math.sin(angle) * d, 0, 0, 0.15, {
          sparks: SKY_SPARKS.volt,
        });
      }
      return t < BREATH.live + 0.12 && e.hp > 0;
    },
    draw() {
      place();
      const [x, y] = mouthOf(e);
      const fade = 1 - clamp((t - BREATH.live) / 0.12);
      const ux = Math.cos(angle);
      const uy = Math.sin(angle);
      const ex = x + ux * BREATH.reach;
      const ey = y + uy * BREATH.reach;
      glowLine(x, y, ex, ey, 9, WYRM.volt[2], 0.55 * fade);
      line(x, y, ex, ey, WYRM.volt[3], fade);
      let px = x;
      let py = y;
      kinks.forEach((k, i) => {
        const v = (i + 1) / kinks.length;
        const nx = x + ux * BREATH.reach * v - uy * k;
        const ny = y + uy * BREATH.reach * v + ux * k;
        hairline(px, py, nx, ny, t < 0.06 ? 0xffffff : WYRM.volt[4], fade);
        px = nx;
        py = ny;
      });
      glow(x, y, 9, WYRM.volt[4], 0.7 * fade);
    },
  };
}
