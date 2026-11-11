import { WORLD_COLORS as WC } from "../../../constants/palette";
import { BRAZIERS, H, W } from "../../../constants/stage";
import { fleck, glow, hairline, line, px, sparkle } from "../../../engine/frame";
import { mix, scale, WHITE } from "../../../utils/color";
import { grain } from "../../../utils/grain";
import { RIBBONS, ribbonTop } from "./aurora";
import { CRYSTAL, FLAME_MAGIC, FLAME_NIGHT, MOTES, RIBBON_LIGHT, RUNE_HUES, TEAR } from "./colors";
import { grownBy, veilAt } from "./growth";
import type { CrystalLight } from "./growths";
import { ISLANDS } from "./islands";
import { RUNES, runeLit } from "./runes";
import { TEARS } from "./tears";

/** What moves in the twilight each frame: flames, rising motes, light drifting along the aurora, pulsing crystal and runes. */

const MOTE_PATHS = Array.from({ length: 26 }, (_, i) => ({
  x: (i * 71 + 13) % W,
  v: 7 + (i % 5) * 3,
  p: i * 2.3,
  big: i % 3 === 0,
}));
/** patches of light that drift along each ribbon of the aurora */
const DRIFTS = Array.from({ length: 6 }, (_, i) => ({
  ribbon: i % RIBBONS.length,
  at: i * 61,
  speed: 5 + (i % 3) * 2,
}));
const GLINT_EVERY = 2.6;

/** each brazier burns with a flame of its own that cools from orange toward blue-violet */
export function drawFlames(t: number, k: number): void {
  for (const b of BRAZIERS) {
    const base = b.y - 7;
    for (let j = 0; j < 8; j++) {
      const u = j / 8;
      const sway = Math.sin(t * 11 + j * 0.9 + b.x) * u * 1.6;
      const w = (1 - u) * 2.6 + Math.sin(t * 17 + j + b.x) * 0.4;
      if (w < 0.3) continue;
      const i = Math.min(3, Math.floor(u * 3.2 + (Math.sin(t * 23 + b.x + j) > 0.6 ? 1 : 0)));
      const c = mix(FLAME_NIGHT[i], FLAME_MAGIC[i], k);
      line(b.x + sway - w, base - j, b.x + sway + w, base - j, c);
      if (j < 3) px(b.x + sway, base - j, WHITE);
    }
    // a thin tongue licks up past the body of the flame
    const lick = Math.sin(t * 11 + 7.2 + b.x) * 1.6;
    const tip = mix(FLAME_NIGHT[2], FLAME_MAGIC[2], k);
    hairline(b.x + lick * 0.8, base - 7, b.x + lick * 1.3, base - 10 - Math.sin(t * 19 + b.x), tip, (u) => 1 - u * 0.7);
    const flick = Math.sin(t * 13 + b.x) * 2;
    glow(b.x, b.y - 9, 40 + flick, mix(WC.brazierGlow, FLAME_MAGIC[2], k), 0.32 + Math.sin(t * 9 + b.x) * 0.04);
  }
}

/** colored motes rising slowly from the floor, each with a faint tail, more of them each wave */
export function drawMotes(t: number, k: number): void {
  const n = Math.round(MOTE_PATHS.length * veilAt(k));
  for (let i = 0; i < n; i++) {
    const m = MOTE_PATHS[i];
    const y = H - 20 - ((t * m.v + m.p * 17) % 130);
    const x = m.x + Math.sin(t * 0.8 + m.p) * 8;
    const fade = Math.min(1, (H - 20 - y) / 20, (y - 30) / 30);
    if (fade <= 0) continue;
    const c = MOTES[i % MOTES.length];
    const hot = Math.sin(t * 5 + m.p) > 0.7;
    hairline(
      x + 0.5,
      y + 1,
      x + 0.5 - Math.cos(t * 0.8 + m.p) * 1.5,
      y + 3 + m.v * 0.15,
      scale(c, 0.7),
      (u) => fade * (1 - u),
    );
    if (m.big) px(x, y, hot ? WHITE : c);
    else fleck(x + 0.5, y + 0.5, hot ? WHITE : c);
    glow(x, y, m.big ? 7 : 5, c, 0.26 * fade);
  }
}

/** slow patches of light sliding along the aurora, and the tears breathing */
export function drawVeilLight(t: number, k: number): void {
  const veil = veilAt(k);
  for (const d of DRIFTS) {
    const x = ((t * d.speed + d.at) % (W + 60)) - 30;
    const swell = 0.6 + 0.4 * Math.sin(t * 0.7 + d.at);
    glow(x, ribbonTop(d.ribbon, x) + 5, 24, RIBBON_LIGHT[d.ribbon], 0.13 * veil * swell);
  }
  for (const tear of TEARS) {
    if (!grownBy(k, tear.from)) continue;
    const beat = 0.5 + 0.5 * Math.sin(t * 1.3 + tear.x);
    glow(tear.x, tear.y, tear.half * 1.1 + beat * 2, TEAR.light, 0.2 + 0.12 * beat);
    // a spark of the other sky's light slips out and sinks away
    const cycle = (t * 0.35 + grain(tear.x, 1)) % 1;
    const sx = tear.x + Math.sin(cycle * 9 + tear.y) * 2.5;
    fleck(sx, tear.y + cycle * 16, cycle < 0.7 ? TEAR.rim : TEAR.crack, 1 - cycle);
  }
}

/** crystals and runes pulse slowly, and now and then a crystal's tip catches the light */
export function drawGrowthLight(t: number, k: number, lights: readonly CrystalLight[]): void {
  lights.forEach((c, i) => {
    const pulse = 0.5 + 0.5 * Math.sin(t * 1.7 + c.x);
    glow(c.x, c.y, c.radius + pulse * 2, c.color, 0.2 + 0.14 * pulse);
    const beat = t / GLINT_EVERY + grain(i, 5);
    const phase = beat - Math.floor(beat);
    if (phase < 0.12 && grain(i, Math.floor(beat)) < 0.5)
      sparkle(c.x, c.y - c.radius * 0.35, 2 + phase * 10, WHITE, c.color, 0.25);
  });
  for (const [ix, iy, , from] of ISLANDS)
    if (grownBy(k, from)) glow(ix - 1, iy - 3, 8, CRYSTAL[3], 0.2 + Math.sin(t * 2 + ix) * 0.07);
  const veil = veilAt(k);
  for (const u of RUNES)
    if (runeLit(u, k)) glow(u.x + 1.5, u.y + 2, 6, RUNE_HUES[u.hue], (0.2 + Math.sin(t * 1.9 + u.x) * 0.1) * veil);
}
