import { WORLD_COLORS as WC } from "../../constants/palette";
import { BRAZIERS } from "../../constants/stage";
import { glow, place } from "../../engine/frame";
import { particles } from "../../game/state";
import { PK } from "../../types/particle";
import { lerp } from "../../utils/math";
import { Rng } from "../../utils/rng";
import { paintClouds, SUN } from "./rain/clouds";
import { paintFloor } from "./rain/floor";
import { drawLightning, lightningFlash } from "./rain/lightning";
import { RAIN_COLORS as RC, rainPalette } from "./rain/palette";
import { drawRunoff } from "./rain/runoff";
import { paintSlabs } from "./rain/slabs";
import { paintTowers } from "./rain/towers";
import { paintMist, paintVeils } from "./rain/veils";
import { drawPuddleLight, drawRain, drawSplashes, updateRain } from "./rain/weather";
import type { SceneDef } from "./sceneDef";

/** Waves 6 to 10: an overcast afternoon that builds from a grey drizzle into a dark storm with far lightning. */

const steam = new Rng(717);
/** the braziers burn low in the wet */
const BRAZIER_FIRE = 0.5;

export const rain: SceneDef = {
  palette: rainPalette,
  stars: 0,
  windows: 0.28,
  braziers: BRAZIER_FIRE,
  mist: 1,
  detail(paint, r, k) {
    const P = rainPalette(k);
    paintClouds(paint, k);
    paintVeils(paint, r, k, P);
    paintTowers(paint, r, P);
    paintMist(paint, P);
    paintFloor(paint, r, BRAZIER_FIRE);
    paintSlabs(paint, r, P, BRAZIER_FIRE);
  },
  ambient(t, k) {
    place();
    if (k < 1) glow(SUN.x, SUN.y, 70, RC.sunGlow, 0.1 * (1 - k));
    // the braziers sputter in the wet, their light catching and dropping
    for (const b of BRAZIERS) {
      const sputter = Math.max(0, Math.sin(t * 7.3 + b.x) * Math.sin(t * 2.9 + b.x * 0.3));
      glow(b.x, b.y - 8, 18, WC.brazierGlow, 0.12 * sputter);
    }
    drawLightning(t, k);
    drawPuddleLight(lightningFlash(t, k) / 0.32, k);
  },
  weather(t, k) {
    drawRain(t, k);
    drawRunoff(t, k);
    drawSplashes();
  },
  update(dt, k) {
    updateRain(dt, k);
    // the rain hisses on the coals and sends up wisps of steam
    for (const b of BRAZIERS)
      if (steam.chance(dt * lerp(1.2, 3, k)))
        particles.spawn(PK.SMOKE, b.x + steam.range(-2, 2), b.y - 8, steam.range(-4, 4), -steam.range(6, 12), 0.9, {
          col: RC.steam,
          size: steam.range(1.5, 2.5),
        });
  },
  flash: lightningFlash,
};
