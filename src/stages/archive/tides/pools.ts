import { GROUND, W } from "../../../constants/stage";
import { fleck, glow, shade } from "../../../engine/frame";
import { fxRng, game, hero, particles } from "../../../game/state";
import { PK } from "../../../types/particle";
import type { Platform } from "../../../types/world";
import { mix } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { clamp } from "../../../utils/math";
import { SCENE } from "../scene/palette";
import { inPool, POOLS } from "./places";

const WADE = { slow: 0.5, fastest: 2.2 } as const;
const DEPTH = { above: 1.5, below: 5 } as const;
const INK = SCENE.ink;
const LETTERS = 5;

let lastX: number | null = null;

const wading = (): boolean =>
  game.mode === "play" && hero.state !== "dead" && hero.ground && hero.y >= GROUND - 0.5 && inPool(hero.x);

export function resetPools(): void {
  lastX = null;
}

export function updatePools(): void {
  if (lastX !== null && wading()) {
    const moved = hero.x - lastX;
    if (Math.abs(moved) > 0 && Math.abs(moved) < WADE.fastest) {
      hero.x = lastX + moved * WADE.slow;
      if (fxRng.chance(0.25))
        particles.spawn(
          PK.SPARK,
          hero.x + fxRng.range(-4, 4),
          GROUND - 1,
          -Math.sign(moved) * fxRng.range(10, 30),
          -fxRng.range(30, 70),
          fxRng.range(0.25, 0.45),
          { sparks: [SCENE.inkSheen, INK[4], INK[3], INK[2]], size: 1 },
        );
    }
  }
  lastX = hero.x;
}

function pool(p: Platform, t: number): void {
  const mid = (p.x0 + p.x1) / 2;
  const half = (p.x1 - p.x0) / 2 + 2;
  shade(p.x0 - 2, GROUND - DEPTH.above, p.x1 + 2, GROUND + DEPTH.below, (x, y, out) => {
    const u = (x - mid) / half;
    const v = y - GROUND;
    const reach = 1 - u * u;
    if (reach <= 0) return;
    const top = -DEPTH.above * Math.sqrt(reach);
    const bottom = DEPTH.below * Math.sqrt(reach);
    if (v < top || v > bottom) return;
    const swell = Math.sin(x * 0.7 + t * 2.4) * 0.5 + Math.sin(x * 0.23 - t * 1.3) * 0.5;
    if (v < top + 0.6) {
      out.c = swell > 0.3 ? SCENE.inkSheen : INK[3];
      return;
    }
    const depth = clamp((v - top) / (bottom - top));
    out.c = mix(INK[2], INK[0], depth);
    if (Math.abs(v - (top + bottom) * 0.35 - swell * 0.8) < 0.3 && grain(Math.floor(x), 3) < 0.6)
      out.c = mix(out.c, SCENE.inkSheen, 0.5);
  });
  for (let i = 0; i < LETTERS; i++) {
    const drift = (t * (2 + i * 0.6) + grain(i, p.x0) * 40) % (p.x1 - p.x0 - 4);
    const x = p.x0 + 2 + drift;
    const y = GROUND + 1 + grain(p.x0, i) * 2.5;
    const pulse = 0.5 + Math.sin(t * 3 + i * 1.9) * 0.5;
    fleck(x, y, SCENE.letter, 0.5 + pulse * 0.5);
    fleck(x + 0.5, y, SCENE.letter, pulse * 0.6);
    fleck(x + 0.5, y - 0.5, SCENE.letterHot, pulse * 0.7);
  }
  const pop = (t * 1.7 + p.x0 * 0.13) % 1;
  if (pop < 0.25) {
    const x = p.x0 + 3 + grain(Math.floor(t * 1.7 + p.x0 * 0.13), p.x0) * (p.x1 - p.x0 - 6);
    fleck(x, GROUND - 1 - pop * 4, SCENE.inkSheen, 1 - pop * 4);
  }
  glow(mid, GROUND + 1, half * 0.8, SCENE.letter, 0.07);
}

export function drawPools(cameraX: number, t: number): void {
  for (const p of POOLS) if (p.x1 >= cameraX - 8 && p.x0 <= cameraX + W + 8) pool(p, t);
}
