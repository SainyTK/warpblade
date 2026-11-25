import { SPELL_IMPACT_TIME } from "../../../drill";
import { disc, ellipseRing, glow, hairline, place, polygon, sparkle } from "../../../engine/frame";
import { fxRng, particles } from "../../../game/state";
import type { ElementImpact } from "../../../types/drill";
import { PK } from "../../../types/particle";
import { clamp, ease, smooth, TAU } from "../../../utils/math";
import { FOE } from "../foes/colors";

const C = FOE.crystal;
const SHARDS = 8;

function flake(r: number, a: number): void {
  for (let i = 0; i < 6; i++) {
    const ang = (i / 6) * TAU + 0.26;
    const x = Math.cos(ang) * r;
    const y = Math.sin(ang) * r;
    hairline(0, 0, x, y, FOE.eyeHot, a);
    hairline(
      x * 0.55,
      y * 0.55,
      x * 0.55 + Math.cos(ang + 0.8) * r * 0.25,
      y * 0.55 + Math.sin(ang + 0.8) * r * 0.25,
      C[3],
      a,
    );
    hairline(
      x * 0.55,
      y * 0.55,
      x * 0.55 + Math.cos(ang - 0.8) * r * 0.25,
      y * 0.55 + Math.sin(ang - 0.8) * r * 0.25,
      C[3],
      a,
    );
  }
}

export function drawFrostBurst(blast: ElementImpact): void {
  const { x, y, age, face, spell, fromSword } = blast;
  const u = clamp(age / SPELL_IMPACT_TIME);
  const fade = 1 - smooth(0.35, 1, u);
  const size = (fromSword ? 0.6 : 1) * spell.radius;
  const grow = ease.outCubic(u);
  place(x, y, face < 0);
  glow(0, 0, 10 + size * 0.8, C[2], 0.7 * fade);
  disc(0, 0, 6 * (1 - u), FOE.eyeHot, fade);
  ellipseRing(0, 0, 4 + grow * size, (4 + grow * size) * 0.7, C[3], fade);
  ellipseRing(0, 0, 2 + grow * size * 0.7, (2 + grow * size * 0.7) * 0.7, C[1], fade * 0.7);
  for (let i = 0; i < SHARDS; i++) {
    const a = (i / SHARDS) * TAU + 0.4;
    const reach = size * (0.35 + 0.35 * grow) * (i % 2 ? 0.75 : 1);
    const cx = Math.cos(a) * reach;
    const cy = Math.sin(a) * reach * 0.75;
    const ux = Math.cos(a);
    const uy = Math.sin(a);
    const len = 4 + (i % 3);
    polygon(
      [
        [cx + ux * len, cy + uy * len],
        [cx - uy * 1.4, cy + ux * 1.4],
        [cx - ux * 1.5, cy - uy * 1.5],
        [cx + uy * 1.4, cy - ux * 1.4],
      ],
      i % 3 ? C[2] : C[3],
      fade,
    );
    hairline(cx, cy, cx + ux * len, cy + uy * len, FOE.eyeHot, fade);
  }
  flake(5 + grow * 6, fade);
  sparkle(0, 0, 4 + grow * 4, C[3], FOE.eyeHot, 0.5 * fade);
  place();
}

export function frostSpray(x: number, y: number, level: number): void {
  for (let i = 0; i < 6 + level * 2; i++) {
    const a = fxRng.range(0, TAU);
    const v = fxRng.range(40, 120);
    particles.spawn(PK.SHARD, x, y, Math.cos(a) * v, Math.sin(a) * v - 40, fxRng.range(0.4, 0.7), {
      col: fxRng.pick(C),
      size: fxRng.range(1, 2),
    });
  }
  for (let i = 0; i < 6; i++)
    particles.spawn(
      PK.FLAKE,
      x + fxRng.range(-8, 8),
      y + fxRng.range(-6, 6),
      fxRng.range(-12, 12),
      fxRng.range(4, 16),
      1,
      {
        col: C[4],
      },
    );
}
