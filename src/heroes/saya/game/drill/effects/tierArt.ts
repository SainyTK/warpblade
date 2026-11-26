import { H } from "../../../../../constants/stage";
import { disc, ellipseRing, fleck, glow, glowLine, hairline, line, polygon } from "../../../../../engine/frame";
import type { SkillCast } from "../../../../../types/drill";
import { WHITE } from "../../../../../utils/color";
import { ease, smooth, TAU } from "../../../../../utils/math";
import { INK_RAMP } from "../../../look/ramp";

function inkStroke(x0: number, y0: number, x1: number, y1: number, width: number, fade: number): void {
  const dx = x1 - x0;
  const dy = y1 - y0;
  const length = Math.hypot(dx, dy) || 1;
  const nx = (-dy / length) * width;
  const ny = (dx / length) * width;
  polygon(
    [
      [x0, y0],
      [x0 + dx * 0.3 + nx, y0 + dy * 0.3 + ny],
      [x1, y1],
      [x0 + dx * 0.4 - nx * 0.6, y0 + dy * 0.4 - ny * 0.6],
    ],
    INK_RAMP[1],
    fade,
  );
  line(x0, y0, x1, y1, WHITE, fade);
}

export function drawMoonlitDraw({ tier }: SkillCast, u: number, fade: number): void {
  const reach = tier.reach * ease.outCubic(smooth(0, 0.3, u));
  glowLine(6, -16, reach, -17, 6, tier.color, 0.7 * fade);
  inkStroke(6, -15, reach, -18, 3.4, fade);
  hairline(10, -13, reach * 0.9, -15, INK_RAMP[5], fade * 0.8);
  for (let i = 0; i < 9; i++) {
    fleck(10 + ((i * 29) % Math.max(1, reach)), -20 + ((i * 7) % 9), i % 2 ? WHITE : INK_RAMP[4], fade);
  }
}

export function drawCrescentEdge({ tier }: SkillCast, u: number, fade: number): void {
  const grow = ease.outCubic(smooth(0, 0.35, u));
  const cx = 10 + tier.reach * 0.35 * grow;
  const radius = 14 + tier.reach * 0.38 * grow;
  glow(cx, -22, radius, tier.color, 0.55 * fade);
  const outer: [number, number][] = [];
  const inner: [number, number][] = [];
  for (let i = 0; i <= 12; i++) {
    const a = -1.45 + (i / 12) * 2.9;
    outer.push([cx + Math.cos(a) * radius * 0.6, -22 + Math.sin(a) * radius]);
    inner.push([cx - radius * 0.18 + Math.cos(a) * radius * 0.42, -22 + Math.sin(a) * radius * 0.82]);
  }
  polygon([...outer, ...inner.reverse()], INK_RAMP[2], fade);
  for (let i = 1; i < outer.length; i++) {
    line(outer[i - 1][0], outer[i - 1][1], outer[i][0], outer[i][1], WHITE, fade);
  }
}

export function drawThousandLines({ tier }: SkillCast, u: number, fade: number): void {
  const reveal = smooth(0, 0.4, u);
  glow(tier.reach * 0.5, -22, tier.reach * 0.5, INK_RAMP[3], 0.5 * fade);
  for (let i = 0; i < 24; i++) {
    const at = (i + 0.5) / 24;
    if (at > reveal) break;
    const x = 12 + at * (tier.reach - 12);
    const tilt = ((i * 53) % 17) / 17 - 0.5;
    const half = 12 + ((i * 11) % 9);
    const c = Math.cos(tilt * 2.4) * half;
    const s = Math.sin(tilt * 2.4) * half;
    inkStroke(x - c, -20 - s, x + c, -20 + s, 1.6, fade);
  }
  hairline(4, -14, tier.reach * reveal, -14, tier.color, fade);
}

export function drawSilentMoon({ tier }: SkillCast, u: number, fade: number): void {
  const rise = ease.outCubic(smooth(0, 0.3, u));
  const moonY = -40 - 30 * rise;
  glow(0, moonY, 46, tier.color, 0.6 * fade);
  disc(0, moonY, 22 * rise, INK_RAMP[5], fade);
  disc(6, moonY - 3, 19 * rise, INK_RAMP[0], fade * 0.9);
  ellipseRing(0, moonY, 24 * rise, 24 * rise, WHITE, fade);
  const strike = smooth(0.2, 0.45, u);
  for (let i = 0; i < 16; i++) {
    const side = i % 2 ? 1 : -1;
    const x = side * (0.08 + ((i * 37) % 92) / 100) * tier.reach * strike;
    const tilt = ((i * 7) % 5) / 5 - 0.5;
    const top = -H * 0.18 - ((i * 13) % 30);
    inkStroke(x - 6 * tilt, top, x + 6 * tilt, -2, 1.4, fade * strike);
  }
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * TAU;
    hairline(0, moonY, Math.cos(a) * 34 * rise, moonY + Math.sin(a) * 34 * rise, INK_RAMP[5], 0.4 * fade);
  }
  ellipseRing(0, -2, tier.reach * strike, 6, tier.color, fade * 0.7);
}
