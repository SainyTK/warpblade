import { H } from "../../../../../constants/stage";
import { disc, ellipseRing, glow, glowLine, hairline, polygon, sparkle } from "../../../../../engine/frame";
import type { SkillCast } from "../../../../../types/drill";
import { ease, smooth, TAU } from "../../../../../utils/math";
import { ROSE_RAMP } from "../../../look/rose";

const WHITE = 0xffffff;

function petal(x: number, y: number, angle: number, size: number, color: number, alpha: number): void {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  polygon(
    [
      [x - c * size, y - s * size],
      [x - s * size * 0.45, y + c * size * 0.45],
      [x + c * size, y + s * size],
      [x + s * size * 0.45, y - c * size * 0.45],
    ],
    color,
    alpha,
  );
}

function needle(x0: number, y0: number, length: number, angle: number, color: number, fade: number): void {
  const x1 = x0 + Math.cos(angle) * length;
  const y1 = y0 + Math.sin(angle) * length;
  glowLine(x0, y0, x1, y1, 9, color, 0.6 * fade);
  polygon(
    [
      [x0, y0 - 2.2],
      [x1, y1],
      [x0, y0 + 2.2],
    ],
    color,
    fade,
  );
  hairline(x0 + (x1 - x0) * 0.2, y0 + (y1 - y0) * 0.2, x1, y1, WHITE, fade);
  sparkle(x1, y1, 5, color, WHITE, fade);
}

export function drawRoseThrust({ tier }: SkillCast, u: number, fade: number): void {
  const length = 14 + ease.outExpo(u) * (tier.reach - 14);
  needle(12, -17, length, 0, tier.color, fade);
  for (let i = 0; i < 6; i++) {
    const t = (i + 1) / 7;
    petal(12 + length * t, -17 + Math.sin(u * 9 + i) * 5, u * 4 + i, 2.6, ROSE_RAMP[4 + (i % 2)], fade * 0.8);
  }
  glow(12 + length, -17, 18, tier.color, fade * 0.7);
}

export function drawRisingRose({ tier }: SkillCast, u: number, fade: number): void {
  const length = 14 + ease.outExpo(u) * (tier.reach - 14);
  needle(10, -16, length, -0.08, tier.color, fade);
  needle(10, -18, length * 0.82, -0.36, ROSE_RAMP[4], fade);
  needle(10, -20, length * 0.64, -0.66, ROSE_RAMP[5], fade);
  for (let i = 0; i < 10; i++) {
    const a = -0.1 - (i % 3) * 0.28;
    const d = length * (0.3 + ((i * 7) % 10) * 0.07);
    petal(10 + Math.cos(a) * d, -18 + Math.sin(a) * d - u * 10, u * 5 + i, 2.4, ROSE_RAMP[3 + (i % 3)], fade);
  }
}

export function drawThornGale({ tier }: SkillCast, u: number, fade: number): void {
  const reach = 10 + ease.outCubic(u) * tier.reach;
  const height = tier.height;
  glowLine(8, -18, reach, -18, height * 0.5, tier.color, fade * 0.45);
  ellipseRing(reach, -18, 10, height * 0.5, tier.color, fade);
  for (let i = 0; i < 26; i++) {
    const t = ((i * 0.137 + u * 1.6) % 1) * (reach - 8);
    const a = i * 1.7 + u * 12;
    const y = -18 + Math.sin(a) * height * 0.45;
    petal(8 + t, y, a, 2.8, ROSE_RAMP[3 + (i % 3)], fade);
    if (i % 3 === 0) {
      hairline(8 + t - 10, y, 8 + t, y + 2, WHITE, fade * 0.8);
    }
  }
  needle(6, -18, reach, 0, WHITE, fade);
}

export function drawRoseTempest({ tier }: SkillCast, u: number, fade: number): void {
  const radius = 10 + ease.outCubic(u) * tier.reach;
  glow(0, -22, 60, tier.color, fade * 0.8);
  glowLine(0, -2, 0, -H, 14 * fade + 2, ROSE_RAMP[4], fade * 0.5);
  ellipseRing(0, -3, radius, radius * 0.22, ROSE_RAMP[4], fade);
  ellipseRing(0, -4, radius * 0.8, radius * 0.18, WHITE, fade * 0.8);
  for (let layer = 0; layer < 3; layer++) {
    const ring = radius * (0.35 + layer * 0.25) * smooth(layer * 0.08, 0.4 + layer * 0.1, u);
    const count = 6 + layer * 4;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * TAU + u * (layer % 2 ? -2 : 2.4);
      petal(
        Math.cos(a) * ring,
        -22 + Math.sin(a) * ring * 0.42,
        a + Math.PI / 2,
        5 - layer,
        ROSE_RAMP[3 + layer],
        fade * 0.9,
      );
    }
  }
  disc(0, -22, 10 * fade, WHITE, fade * 0.85);
}
