import { H } from "../../../../../constants/stage";
import { disc, ellipseRing, glow, glowLine, hairline, polygon } from "../../../../../engine/frame";
import type { SkillCast } from "../../../../../types/drill";
import { ease, smooth, TAU } from "../../../../../utils/math";

const WHITE = 0xffffff;
const GOLD = 0xffe066;

function blast(x: number, y: number, r: number, color: number, fade: number): void {
  glow(x, y, r + 10, color, 0.7 * fade);
  disc(x, y, r * 0.6, color, 0.8 * fade);
  disc(x, y, r * 0.3, WHITE, fade);
}

export function drawBreachCut({ tier }: SkillCast, u: number, fade: number): void {
  const x = 12 + ease.outCubic(u) * tier.reach * 0.7;
  const y = -16;
  glow(x, y, 26, tier.color, fade * 0.7);
  polygon(
    [
      [x - 30, y - 22],
      [x - 4, y - 18],
      [x + 12, y - 8],
      [x + 17, y + 2],
      [x + 9, y + 12],
      [x - 12, y + 18],
      [x - 2, y + 8],
      [x + 4, y - 2],
      [x - 6, y - 12],
    ],
    tier.color,
    fade,
  );
  hairline(x - 6, y - 12, x + 12, y - 4, WHITE, fade);
  blast(x + 18, y, 9 * (1 - u * 0.5), GOLD, fade);
}

export function drawBuckshotWall({ tier }: SkillCast, u: number, fade: number): void {
  const spread = ease.outCubic(u);
  for (let i = 0; i < 9; i++) {
    const a = -0.5 + (i / 8) * 1;
    const d = tier.reach * spread * (0.75 + ((i * 5) % 4) * 0.08);
    const x = 14 + Math.cos(a) * d;
    const y = -18 + Math.sin(a) * d * 0.5;
    hairline(14, -18, x, y, tier.color, (t) => t * fade);
    disc(x, y, 1.8, WHITE, fade);
    glow(x, y, 6, tier.color, fade * 0.5);
  }
  blast(14, -18, 10 * (1 - u), tier.color, fade);
  ellipseRing(14, -18, 6 + 12 * u, 10 + 20 * u, tier.color, fade * 0.6);
}

export function drawGreenLine({ tier }: SkillCast, u: number, fade: number): void {
  const end = 16 + ease.outExpo(Math.min(1, u * 1.6)) * tier.reach;
  const y = -19;
  const width = 6 * fade + 1;
  glowLine(16, y, end, y, 20, tier.color, fade * 0.8);
  polygon(
    [
      [16, y - width * 0.5],
      [end, y - 1],
      [end, y + 1],
      [16, y + width * 0.5],
    ],
    tier.color,
    fade,
  );
  hairline(16, y, end, y, WHITE, fade);
  for (let i = 1; i < 6; i++) {
    const x = 16 + ((end - 16) * i) / 6;
    const r = 4 + 6 * smooth(0, 1, u) * fade;
    ellipseRing(x, y, r * 0.35, r, tier.color, fade * 0.8);
  }
  blast(16, y, 8 * (1 - u), WHITE, fade);
}

export function drawCylinderBreak({ tier }: SkillCast, u: number, fade: number): void {
  const radius = 10 + ease.outCubic(u) * tier.reach;
  glow(0, -20, 50, tier.color, fade * 0.8);
  glowLine(0, -2, 0, -H, 10 * fade + 2, 0x9ae05a, fade * 0.45);
  ellipseRing(0, -3, radius, radius * 0.22, tier.color, fade);
  ellipseRing(0, -4, radius * 0.8, radius * 0.18, 0x9ae05a, fade * 0.8);
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * TAU + u * 3;
    const d = radius * 0.55;
    const bx = Math.cos(a) * d;
    const by = -20 + Math.sin(a) * d * 0.35;
    const pop = smooth(i * 0.08, i * 0.08 + 0.2, u);
    blast(bx, by, 10 * pop, i % 2 ? GOLD : 0x9ae05a, fade * pop);
  }
  disc(0, -20, 10 * fade, WHITE, fade);
}
