import { H, W } from "../../constants/stage";
import { disc, ellipseRing, fleck, glow, glowLine, hairline, place, polygon } from "../../engine/frame";
import type { DrillProfile, SkillCast } from "../../types/drill";
import { clamp, ease, smooth, TAU } from "../../utils/math";
import { drawTierArt } from "./effectArt";

const WHITE = 0xfaffff;

export function drawSkillDarkness(cast: SkillCast | null, cameraX: number): void {
  if (!cast) {
    return;
  }
  const { age, tier } = cast;
  const darkness = smooth(0, 0.13, age) * (1 - smooth(tier.intro, tier.intro + 0.24, age));
  place(cameraX);
  polygon(
    [
      [0, 0],
      [W, 0],
      [W, H],
      [0, H],
    ],
    0x121024,
    0.65 * darkness,
  );
}

function crescent(reach: number, color: number, u: number, fade: number): void {
  const x = 10 + ease.outCubic(u) * reach * 0.75;
  const y = -15;
  glow(x, y, 23, color, fade * 0.4);
  polygon(
    [
      [x - 27, y - 19],
      [x - 6, y - 16],
      [x + 9, y - 9],
      [x + 15, y],
      [x + 9, y + 9],
      [x - 7, y + 15],
      [x - 29, y + 16],
      [x - 10, y + 10],
      [x + 1, y + 2],
      [x - 2, y - 7],
      [x - 13, y - 13],
    ],
    color,
    fade,
  );
  hairline(x - 11, y - 13, x + 10, y - 4, WHITE, fade);
  hairline(x + 10, y - 4, x + 12, y + 1, WHITE, fade);
  for (let i = 0; i < 11; i++) {
    fleck(x - ((i * 7) % 25) - u * 15, y - 10 + ((i * 13) % 21), color, fade * 0.79);
  }
}

function spires(reach: number, color: number, u: number, fade: number): void {
  for (let i = 0; i < 4; i++) {
    const pulse = smooth(i * 0.055, 0.23 + i * 0.055, u);
    if (pulse <= 0) continue;
    const x = 19 + (i / 3) * (reach - 19);
    const h = (40 + i * 6) * pulse;
    const lean = 4 + i * 2;
    glow(x, -h * 0.35, 22, color, fade * pulse * 0.3);
    ellipseRing(x, -2, 9 + pulse * 4, 3, color, fade * pulse);
    polygon(
      [
        [x - 8, 0],
        [x - 5, -h * 0.58],
        [x + lean, -h],
        [x + 8, -h * 0.47],
        [x + 9, -3],
      ],
      color,
      fade * 0.76,
    );
    polygon(
      [
        [x - 2, 0],
        [x + 1, -h * 0.66],
        [x + lean, -h],
        [x + 3, -3],
      ],
      WHITE,
      fade * 0.88,
    );
    hairline(x + 2, -5, x + 12, -h * 0.67, color, fade);
  }
}

function rift(reach: number, color: number, u: number, fade: number): void {
  const x0 = -22;
  const y0 = -69;
  const x1 = ease.outExpo(u * 0.88) * reach;
  const y1 = -23 + u * 14;
  const width = 8 * fade + 1;
  glowLine(x0, y0, x1, y1, 23, color, fade * 0.4);
  polygon(
    [
      [x0, y0],
      [x1 * 0.55, y0 * 0.38 + y1 * 0.62 - width],
      [x1, y1],
      [x1 * 0.64, y0 * 0.34 + y1 * 0.66 + width],
    ],
    color,
    fade,
  );
  hairline(x0, y0, x1, y1, WHITE, fade);
  for (let i = 0; i < 13; i++) {
    const t = i / 13;
    const x = x0 + (x1 - x0) * t;
    const y = y0 + (y1 - y0) * t;
    const side = i % 2 ? 1 : -1;
    const jump = (10 + ((i * 11) % 22)) * Math.sin(Math.PI * t);
    hairline(x, y, x + 6, y + side * jump, color, fade * 0.7);
    hairline(x + 6, y + side * jump, x + 18, y + side * (jump + 3), color, fade * 0.46);
  }
}

function nova(reach: number, color: number, u: number, fade: number): void {
  const radius = 9 + ease.outCubic(u) * reach;
  glow(0, -21, 52, color, fade * 0.45);
  glowLine(0, -3, 0, -H, 15 * fade + 2, color, fade * 0.3);
  ellipseRing(0, -3, radius, radius * 0.23, color, fade);
  ellipseRing(0, -5, radius * 0.84, radius * 0.19, WHITE, fade * 0.88);
  ellipseRing(0, -22, radius * 0.63, radius * 0.41, color, fade * 0.57);
  disc(0, -21, 12 * fade, WHITE, fade * 0.86);
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * TAU + u * 0.6;
    const d = radius * (0.35 + ((i * 13) % 7) * 0.1);
    const x = Math.cos(a) * d;
    const y = -20 + Math.sin(a) * d * 0.43;
    hairline(x, y, x * 1.09, y - (i % 4) * 2 - 4, i % 3 ? color : WHITE, fade);
  }
}

export function drawSkillImpact(profile: DrillProfile, cast: SkillCast | null): void {
  if (!cast) return;
  const { x, y, face, age, tier } = cast;
  place(x, y, face < 0);
  const { intro, duration, reach, color } = tier;
  if (age < intro) {
    const pulse = smooth(0, intro * 0.54, age);
    glow(0, -20, 20 + 10 * pulse, color, pulse * 0.58);
    ellipseRing(0, -4, 9 + 9 * pulse, 4, color, pulse * 0.86);
  } else {
    const u = clamp((age - intro) / (duration - intro));
    const fade = 1 - smooth(0.16, 1, u);
    drawTierArt(profile, cast, u, fade);
    place(x, y, face < 0);
    if (tier.drawStrike) {
      tier.drawStrike(cast, u, fade);
      place();
      return;
    }
    switch (tier.look) {
      case "crescent":
        crescent(reach, color, u, fade);
        break;
      case "spires":
        spires(reach, color, u, fade);
        break;
      case "rift":
        rift(reach, color, u, fade);
        break;
      case "nova":
        nova(reach, color, u, fade);
        break;
    }
  }
  place();
}
