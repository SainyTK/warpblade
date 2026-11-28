import { ellipseRing, fleck, glow, place } from "../../../../engine/frame";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { fxRng, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp, TAU } from "../../../../utils/math";
import { FOE, FOE_SPARKS } from "../colors";
import { ageWard } from "./state";

const G = FOE.glyph;
const RISE = 0.3;

function shatter(x: number, y: number): void {
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * TAU;
    particles.spawn(PK.SPARK, x, y, Math.cos(a) * 60, Math.sin(a) * 60, fxRng.range(0.2, 0.4), {
      sparks: FOE_SPARKS.glyph,
    });
  }
}

export function createWardRing(ally: Enemy): Effect {
  let age = 0;
  let left = 1;
  return {
    update(dt) {
      age += dt;
      left = ageWard(ally, dt);
      if (left > 0) return true;
      const [cx, cy] = enemyCenter(ally);
      shatter(cx, cy);
      return false;
    },
    draw() {
      place();
      const [cx, cy] = enemyCenter(ally);
      const [x0, y0, x1, y1] = enemyBox(ally);
      const rx = (x1 - x0) / 2 + 4;
      const ry = (y1 - y0) / 2 + 4;
      const a = clamp(age / RISE) * (left < 1 && Math.floor(age * 16) % 2 === 0 ? 0.4 : 1);
      glow(cx, cy, Math.max(rx, ry) + 6, G[2], 0.16 * a);
      ellipseRing(cx, cy, rx, ry, G[3], 0.7 * a);
      ellipseRing(cx, cy, rx - 1.5, ry - 1.5, G[1], 0.35 * a);
      for (let i = 0; i < 6; i++) {
        const t = age * 1.6 + (i * TAU) / 6;
        fleck(cx + Math.cos(t) * rx, cy + Math.sin(t) * ry, i % 2 ? G[4] : G[3], a);
      }
    },
  };
}
