import { WORLD_COLORS as WC } from "../../constants/palette";
import { BRAZIERS, MOON, W } from "../../constants/stage";
import { glow, place, px } from "../../engine/frame";
import { particles, rng } from "../../game/state";
import { PK } from "../../types/particle";
import { mix, WHITE } from "../../utils/color";
import { drawFireflies, drawMoon } from "./night";
import type { SceneDef } from "./sceneDef";
import { PLANET_AT, PLANET_FROM, paintMoonRing, paintPlanet } from "./twilight/celestial";
import { FLAME_MAGIC, FLAME_NIGHT, MOON_HALO, PLANET_LIGHT } from "./twilight/colors";
import { veilAt } from "./twilight/growth";
import { type CrystalLight, paintGrowths } from "./twilight/growths";
import { paintIslands } from "./twilight/islands";
import { drawFlames, drawGrowthLight, drawMotes, drawVeilLight } from "./twilight/life";
import { twilightPalette } from "./twilight/palette";
import { paintRunes } from "./twilight/runes";
import { paintSky } from "./twilight/skyPlate";
import { paintSlabLight, paintTowerStone, paintVeins } from "./twilight/stonework";
import { paintTears } from "./twilight/tears";

/** Waves 16 to 20: the moonlit ruins of the night under a veil that thins wave by wave, letting another world through. */

/** the brazier ember ramps for k = 0, .25, .5, .75, 1 */
const EMBERS = [0, 0.25, 0.5, 0.75, 1].map((k) => FLAME_NIGHT.map((c, i) => mix(c, FLAME_MAGIC[i], k)));
const haloAt = (k: number) => mix(WC.moonHalo, MOON_HALO, k);
/** the crystals painted on the plate now showing, for the frame's light */
let crystalLights: readonly CrystalLight[] = [];

export const twilight: SceneDef = {
  palette: twilightPalette,
  stars: (k) => Math.round(90 + 50 * k),
  windows: 0.5,
  // the shared braziers burn orange; this era draws its own flames, turning blue-violet
  braziers: 0,
  mist: 1,
  sky(bg, _r, k) {
    drawMoon(bg, haloAt(k));
  },
  detail(paint, r, k) {
    const P = twilightPalette(k);
    const veil = veilAt(k);
    const horizon = P.sky[P.sky.length - 1];
    paintSky(paint, P, veil, haloAt(k));
    paintTears(paint, r, k);
    paintMoonRing(paint, k);
    paintPlanet(paint, k);
    paintIslands(paint, k, horizon);
    paintTowerStone(paint, P, veil);
    paintSlabLight(paint, veil);
    paintVeins(paint, r, veil, horizon);
    paintRunes(paint, k, horizon);
    crystalLights = paintGrowths(paint, P, k);
  },
  ambient(t, k) {
    place();
    glow(MOON.x, MOON.y, 60, mix(WC.moonGlow, MOON_HALO, k), 0.26);
    if (k >= PLANET_FROM) glow(PLANET_AT.x, PLANET_AT.y, 18, PLANET_LIGHT, 0.2 * k);
    drawVeilLight(t, k);
    drawGrowthLight(t, k, crystalLights);
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
