import { WORLD_COLORS as WC } from "../../constants/palette";
import { MOON, W } from "../../constants/stage";
import { bayerAt, glow, place, px } from "../../engine/frame";
import { mix, ramp, scale, WHITE } from "../../utils/color";
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

/** fireflies wandering low over the floor */
export function drawFireflies(t: number, count = FIREFLIES.length): void {
  for (const f of FIREFLIES.slice(0, count)) {
    const x = f.x + Math.sin(t * 0.6 + f.p) * 14;
    const y = f.y + Math.sin(t * 0.9 + f.p * 2) * 6;
    const b = Math.max(0, Math.sin(t * 1.8 + f.p * 3));
    if (b <= 0.15) continue;
    px(x, y, b > 0.7 ? WC.fireflyHot : WC.firefly);
    glow(x, y, 7, WC.fireflyGlow, 0.3 * b);
  }
}

export const night: SceneDef = {
  palette: NIGHT_PALETTE,
  stars: 90,
  windows: 0.5,
  braziers: 1,
  mist: 1,
  sky: (bg) => drawMoon(bg),
  ambient(t) {
    place();
    glow(MOON.x, MOON.y, 60, WC.moonGlow, 0.26);
    drawFireflies(t);
    for (let i = 0; i < 6; i++) if (Math.sin(t * 3 + i * 2.1) > 0.85) px((i * 97) % W, (i * 23) % 100, WHITE);
  },
};
