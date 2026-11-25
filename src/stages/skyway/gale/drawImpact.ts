import { SPELL_IMPACT_TIME } from "../../../drill";
import { circle, ellipseRing, fleck, glow, glowLine, hairline, line, place } from "../../../engine/frame";
import type { ElementImpact } from "../../../types/drill";
import { grain } from "../../../utils/grain";
import { clamp, ease, smooth, TAU } from "../../../utils/math";
import { GALE_COLORS as G } from "./colors";

const SKY_TOP = -10;
const SEGMENTS = 9;
const SWIRLS = 6;

function bolt(x: number, y: number, seed: number, a: number, wide: boolean): void {
  let px = x + (grain(seed, 0) - 0.5) * 18;
  let py = SKY_TOP;
  const step = (y - SKY_TOP) / SEGMENTS;
  for (let i = 1; i <= SEGMENTS; i++) {
    const nx = i === SEGMENTS ? x : x + (grain(seed, i) - 0.5) * 14 * (1 - i / SEGMENTS);
    const ny = SKY_TOP + step * i;
    if (wide) {
      line(px - 1, py, nx - 1, ny, G.bolt[1], a * 0.7);
      line(px + 1, py, nx + 1, ny, G.bolt[1], a * 0.7);
    }
    line(px, py, nx, ny, G.bolt[3], a);
    hairline(px + 0.5, py, nx + 0.5, ny, G.core, a);
    if (i % 3 === 1 && a > 0.4) {
      const side = grain(seed, i + 40) > 0.5 ? 1 : -1;
      hairline(nx, ny, nx + side * 9, ny + 6, G.bolt[2], a);
      hairline(nx + side * 9, ny + 6, nx + side * 12, ny + 13, G.bolt[1], a * 0.8);
    }
    px = nx;
    py = ny;
  }
  glowLine(x, SKY_TOP, x, y, wide ? 14 : 9, G.glow, 0.55 * a);
}

function windRing(x: number, y: number, r: number, a: number, spin: number): void {
  ellipseRing(x, y, r, r * 0.3, G.wind[2], a);
  ellipseRing(x, y, r * 0.8, r * 0.24, G.wind[1], a * 0.7, 1);
  for (let i = 0; i < SWIRLS; i++) {
    const a0 = (i / SWIRLS) * TAU + spin;
    for (let k = 0; k < 5; k++) {
      const g = a0 + k * 0.12;
      const rr = r * (0.9 + k * 0.05);
      fleck(
        x + Math.cos(g) * rr,
        y + Math.sin(g) * rr * 0.3 - k * 0.5,
        k < 2 ? G.wind[3] : G.wind[2],
        a * (1 - k * 0.15),
      );
    }
  }
}

export function drawGaleImpact({ x, y, age, fromSword, spell }: ElementImpact): void {
  place();
  const delay = fromSword ? 0 : spell.delay;
  const seed = Math.floor(x * 13 + y * 7);
  if (age < delay) {
    const u = smooth(0, delay, age);
    hairline(x, SKY_TOP, x, y, G.bolt[2], 0.3 + u * 0.4);
    ellipseRing(x, y, spell.radius * 0.6, spell.radius * 0.18, G.wind[1], u);
    glow(x, y - 10, spell.radius, G.glow, 0.3 * u);
    return;
  }
  const progress = clamp((age - delay) / (SPELL_IMPACT_TIME - delay));
  const fade = 1 - smooth(0.2, 1, progress);
  const flick = progress > 0.12 && progress < 0.2 ? 0.35 : 1;
  const scale = fromSword ? 0.6 : 1;
  bolt(x, y, seed, fade * flick, !fromSword);
  if (progress < 0.35) bolt(x, y, seed + 9, fade * 0.6, false);
  if (progress < 0.25) {
    circle(x, y - 1, 4 * scale, G.core);
    hairline(x - 16 * scale, y - 0.5, x + 16 * scale, y - 0.5, G.bolt[3]);
  }
  const r = (6 + ease.outCubic(progress) * spell.radius * 1.4) * scale;
  windRing(x, y, r, fade, progress * 3);
  if (progress > 0.15) windRing(x, y, r * 0.6, fade * 0.7, -progress * 4);
  glow(x, y - 6, 18 + r * 0.6, G.glow, 0.7 * fade);
}
