import { fleck, hairline, line } from "../../../../engine/frame";
import type { FxCast } from "../../../../types/skillFx";
import { grain } from "../../../../utils/grain";
import { clamp, ease, TAU } from "../../../../utils/math";
import { WOUND_RED } from "../../constants/palette";

const GASHES = [1, 2, 3, 4] as const;
const DROPS = [0, 3, 6, 12] as const;
const GRAVITY = 140;

function gash(x: number, y: number, angle: number, length: number, alpha: number): void {
  const dx = Math.cos(angle) * length * 0.5;
  const dy = Math.sin(angle) * length * 0.5;
  line(x - dx, y - dy, x + dx, y + dy, WOUND_RED[2], alpha);
  hairline(x - dx, y - dy - 0.5, x + dx * 0.8, y + dy * 0.8 - 0.5, WOUND_RED[1], alpha);
  fleck(x - dx * 0.6, y - dy * 0.6 - 0.5, WOUND_RED[0], alpha);
}

function drop(x: number, y: number, vx: number, vy: number, time: number, alpha: number): void {
  const px = x + vx * time;
  const py = y + vy * time + 0.5 * GRAVITY * time * time;
  hairline(px, py, px - vx * 0.02, py - (vy + GRAVITY * time) * 0.02, WOUND_RED[1], alpha);
  fleck(px, py, WOUND_RED[2], alpha);
}

export function drawBleed(cast: FxCast, progress: number, fade: number, lift: number, mastery: number): void {
  const rank = cast.feel.rank;
  const scale = Math.sqrt(cast.size);
  const cy = -lift;
  const cut = ease.outExpo(clamp(progress * 4));
  const left = fade * (1 - clamp((progress - 0.6) / 0.4));
  for (let i = 0; i < GASHES[rank]; i++) {
    const angle = -0.7 + i * 1.25 + grain(i, rank) * 0.3;
    const ox = (grain(i, 2) - 0.5) * 5 * scale;
    const oy = cy + (grain(i, 6) - 0.5) * 6 * scale;
    gash(ox, oy, angle, (4 + rank * 1.5) * scale * cut, left);
  }
  const time = progress * 0.6;
  const drops = DROPS[rank] + mastery * 2;
  for (let i = 0; i < drops; i++) {
    const a = -Math.PI / 2 + (grain(i, 11) - 0.5) * (rank >= 2 ? 2.6 : 1.2);
    const speed = (24 + grain(i, 13) * 40) * scale;
    drop(0, cy, Math.cos(a) * speed, Math.sin(a) * speed, time, left);
  }
  if (rank >= 3) {
    const r = 12 * scale * ease.outCubic(clamp(progress * 2));
    const from = -1.2 + progress * 2;
    const steps = 18;
    for (let i = 0; i < steps; i++) {
      const a0 = from + (i / steps) * TAU * 0.8;
      const a1 = from + ((i + 1) / steps) * TAU * 0.8;
      const k = left * (i / steps);
      line(
        Math.cos(a0) * r,
        cy + Math.sin(a0) * r * 0.55,
        Math.cos(a1) * r,
        cy + Math.sin(a1) * r * 0.55,
        WOUND_RED[2],
        k,
      );
      hairline(
        Math.cos(a0) * r,
        cy + Math.sin(a0) * r * 0.55 - 0.5,
        Math.cos(a1) * r,
        cy + Math.sin(a1) * r * 0.55 - 0.5,
        WOUND_RED[1],
        k,
      );
    }
  }
}
