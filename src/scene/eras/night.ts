import { WORLD_COLORS as WC } from "../../constants/palette";
import { MOON, W } from "../../constants/stage";
import { bayerAt, fleck, glow, place, px } from "../../engine/frame";
import { mix, ramp, scale } from "../../utils/color";
import { paintFloor } from "./night/floor";
import { drawMeteor, drawTwinkles } from "./night/life";
import { paintMoon } from "./night/moon";
import { type BrightStar, paintSky } from "./night/sky";
import { paintTowers } from "./night/towers";
import type { SceneDef, ScenePalette } from "./sceneDef";

/** Waves 11 to 15: the moonlit ruins, a little lighter than the old night so the fight still reads. */

export const NIGHT_PALETTE: ScenePalette = {
  sky: ramp(["#141032", "#1c1640", "#261e4e", "#30265c", "#3d2f6a", "#4c3a78"]),
  starDim: WC.starDim,
  starBright: WC.starBright,
  ridgeTop: WC.ridgeTop,
  ridge: WC.ridge,
  towerRim: WC.towerRim,
  towerTop: WC.towerTop,
  tower: WC.tower,
  windowLit: WC.windowLit,
  windowLow: WC.windowLow,
  windowDark: WC.windowDark,
  groundLip: WC.groundLip,
  groundEdge: WC.groundEdge,
  stone: WC.stone,
  stoneTop: WC.stoneTop,
  mortar: WC.mortar,
  moss: WC.moss,
  mossTip: WC.mossTip,
  vine: WC.vine,
  slabLip: WC.slabLip,
  slabEdge: WC.slabEdge,
  slab: WC.slab,
  slabUnder: WC.slabUnder,
  ironLip: WC.ironLip,
  iron: WC.iron,
  ironEdge: WC.ironEdge,
  mist: WC.mist,
};

const CRATERS: readonly (readonly [number, number, number])[] = [
  [-4, -5, 3],
  [5, 2, 2.4],
  [-2, 6, 2],
  [6, -7, 1.5],
];

/** a moon lit from the right with a few craters and a dithered halo */
export function drawMoon(bg: Uint32Array, halo = WC.moonHalo): void {
  const { x: mx, y: my, r: mr } = MOON;
  for (let y = my - 30; y <= my + 30; y++)
    for (let x = mx - 30; x <= mx + 30; x++) {
      if (x < 0 || y < 0 || x >= W) continue;
      const d = Math.hypot(x + 0.5 - mx, y + 0.5 - my);
      const i = y * W + x;
      if (d <= mr) {
        const lit = (x - mx + 6) / mr;
        let c = lit > -0.2 ? WC.moonLit : lit > -0.55 ? WC.moonMid : WC.moonDark;
        for (const [qx, qy, qr] of CRATERS)
          if (Math.hypot(x + 0.5 - mx - qx, y + 0.5 - my - qy) < qr) c = scale(c, 0.86);
        bg[i] = c;
      } else if (d <= mr + 1) bg[i] = WC.moonRim;
      else if (d < mr + 14 && ((mr + 14 - d) / 14) * 0.5 > bayerAt(x, y)) bg[i] = mix(bg[i], halo, 0.6);
    }
}

const FIREFLIES = Array.from({ length: 12 }, (_, i) => ({ x: (i * 53) % W, y: 120 + ((i * 17) % 30), p: i * 1.7 }));
/** a firefly wanders on two slow loops and a small quick one, and its light swells and dies away */
const FIREFLY = { glow: 8, dim: 0.12, hot: 0.72 };

/** fireflies wandering low over the floor */
export function drawFireflies(t: number, count = FIREFLIES.length): void {
  for (let i = 0; i < Math.min(count, FIREFLIES.length); i++) {
    const f = FIREFLIES[i];
    const pulse = Math.sin(t * 1.8 + f.p * 3);
    if (pulse <= FIREFLY.dim) continue;
    const b = pulse * pulse;
    const x = f.x + Math.sin(t * 0.6 + f.p) * 14 + Math.sin(t * 2.3 + f.p * 5) * 2;
    const y = f.y + Math.sin(t * 0.9 + f.p * 2) * 6 + Math.cos(t * 2.9 + f.p * 4) * 1.5;
    if (b > FIREFLY.hot) {
      px(x, y, WC.fireflyHot);
      fleck(x + 1, y + 0.25, WC.firefly);
      fleck(x - 0.5, y + 0.25, WC.firefly);
    } else fleck(x, y, b > 0.3 ? WC.fireflyHot : WC.firefly);
    glow(x, y, FIREFLY.glow * (0.6 + 0.4 * b), WC.fireflyGlow, 0.34 * b);
  }
}

/** the bright stars of the scene last built, for the twinkle */
const sky: { stars: BrightStar[] } = { stars: [] };
/** the moon's wide glow is painted into the scene; this small one over it breathes a little */
const MOON_GLOW = { radius: 34, strength: 0.2, swell: 0.03 };

export const night: SceneDef = {
  palette: NIGHT_PALETTE,
  stars: 90,
  windows: 0.5,
  braziers: 1,
  mist: 1,
  sky: (bg) => drawMoon(bg),
  detail(paint, r) {
    sky.stars = paintSky(paint, r, NIGHT_PALETTE);
    paintMoon(paint);
    paintTowers(paint, r, NIGHT_PALETTE);
    paintFloor(paint);
  },
  ambient(t) {
    place();
    glow(MOON.x, MOON.y, MOON_GLOW.radius, WC.moonGlow, MOON_GLOW.strength + Math.sin(t * 0.7) * MOON_GLOW.swell);
    drawTwinkles(t, sky.stars);
    drawMeteor(t);
    drawFireflies(t);
  },
};
