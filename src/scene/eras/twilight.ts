import { WORLD_COLORS as WC } from "../../constants/palette";
import { BRAZIERS, H, MOON, W } from "../../constants/stage";
import { glow, line, place, px } from "../../engine/frame";
import { particles, rng } from "../../game/state";
import { PK } from "../../types/particle";
import { hex, mix, ramp, WHITE } from "../../utils/color";
import { drawFireflies, drawMoon } from "./night";
import type { SceneDef } from "./sceneDef";
import { CRYSTAL, drawRunesAndCrystals, FLOOR_CRYSTALS, RUNES, runeLit } from "./twilight/decor";
import { twilightPalette } from "./twilight/palette";
import { drawAurora, drawIslands, drawMoonRing, drawPlanet, ISLANDS, PLANET_AT } from "./twilight/sky";

/** Waves 16 to 20: the moonlit ruins of the night, slowly turning into a magical world as the veil thins. */

const FLAME_NIGHT = ramp(["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"]);
const FLAME_MAGIC = ramp(["#f4f0ff", "#c0b8ff", "#8a6aff", "#5a2ac0"]);
/** the brazier ember ramps for k = 0, .25, .5, .75, 1 */
const EMBERS = [0, 0.25, 0.5, 0.75, 1].map((k) => FLAME_NIGHT.map((c, i) => mix(c, FLAME_MAGIC[i], k)));
const RUNE_GLOW = [hex("#5ee8f0"), hex("#c08aff"), hex("#ff8ae8")];
const MOTES = ramp(["#7ff6ff", "#ff8ae8", "#ffe27a", "#b08cff", "#8affc0"]);
const MOTE_PATHS = Array.from({ length: 18 }, (_, i) => ({ x: (i * 71 + 13) % W, v: 9 + (i % 5) * 3, p: i * 2.3 }));
const MOON_GLOW_MAGIC = hex("#7a4ad0");

/** each brazier burns with a flame of its own that cools from orange toward blue-violet */
function drawFlames(t: number, k: number): void {
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
    const flick = Math.sin(t * 13 + b.x) * 2;
    glow(b.x, b.y - 9, 40 + flick, mix(WC.brazierGlow, FLAME_MAGIC[2], k), 0.32 + Math.sin(t * 9 + b.x) * 0.04);
  }
}

/** colored motes rising slowly from the floor, more of them each wave */
function drawMotes(t: number, k: number): void {
  const n = Math.round(MOTE_PATHS.length * k);
  for (let i = 0; i < n; i++) {
    const m = MOTE_PATHS[i];
    const y = H - 20 - ((t * m.v + m.p * 17) % 130);
    const x = m.x + Math.sin(t * 0.8 + m.p) * 8;
    const fade = Math.min(1, (H - 20 - y) / 20, (y - 30) / 30);
    if (fade <= 0) continue;
    const c = MOTES[i % MOTES.length];
    px(x, y, Math.sin(t * 5 + m.p) > 0.7 ? WHITE : c);
    glow(x, y, 6, c, 0.28 * fade);
  }
}

export const twilight: SceneDef = {
  palette: twilightPalette,
  stars: (k) => Math.round(90 + 50 * k),
  windows: 0.5,
  // the shared braziers burn orange; this era draws its own flames, turning blue-violet
  braziers: 0,
  mist: 1,
  sky(bg, _r, k) {
    drawAurora(bg, k);
    drawIslands(bg, k);
    drawMoon(bg, mix(WC.moonHalo, MOON_GLOW_MAGIC, k));
    drawMoonRing(bg, k);
    drawPlanet(bg, k);
  },
  decorate(bg, _r, k) {
    drawRunesAndCrystals(bg, twilightPalette(k), k);
  },
  ambient(t, k) {
    place();
    glow(MOON.x, MOON.y, 60, mix(WC.moonGlow, MOON_GLOW_MAGIC, k), 0.26);
    if (k >= 0.5) glow(PLANET_AT.x, PLANET_AT.y, 18, hex("#4ab0d0"), 0.2 * k);
    for (let i = 0; i < 3; i++) {
      const x = ((t * 6 + i * 110) % (W + 40)) - 20;
      const y = 30 + i * 9 + Math.sin(x * 0.028 + i) * 8;
      glow(x, y, 26, i === 1 ? hex("#a24ae0") : hex("#4ab8c8"), 0.12 * k);
    }
    for (const [ix, iy, , from] of ISLANDS)
      if (k + 0.01 >= from) glow(ix - 1, iy - 2, 7, CRYSTAL[3], 0.2 + Math.sin(t * 2 + ix) * 0.06);
    for (const [x, h, from] of FLOOR_CRYSTALS)
      if (k + 0.01 >= from) glow(x, 155 - h / 2, 10, CRYSTAL[2], 0.25 + Math.sin(t * 1.7 + x) * 0.07);
    for (const u of RUNES)
      if (runeLit(u, k)) glow(u.x + 1, u.y + 2, 6, RUNE_GLOW[u.hue], (0.2 + Math.sin(t * 1.9 + u.x) * 0.08) * k);
    drawFlames(t, k);
    drawFireflies(t, Math.round(12 * (1 - 0.6 * k)));
    drawMotes(t, k);
    for (let i = 0; i < 6; i++) if (Math.sin(t * 3 + i * 2.1) > 0.85) px((i * 97) % W, (i * 23) % 100, WHITE);
  },
  update(_dt, k) {
    const sparks = EMBERS[Math.round(k * 4)];
    for (const b of BRAZIERS)
      if (rng.chance(0.04))
        particles.spawn(PK.EMBER, b.x, b.y - 12, rng.range(-10, 10), -rng.range(20, 40), rng.range(0.8, 1.6), {
          sparks,
        });
  },
};
