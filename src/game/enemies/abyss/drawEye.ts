import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Color } from "../../../types/color";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { hero } from "../../state";
import { AC, rimLight, VOID } from "./colors";
import { block, fang, rimBand, taper } from "./paint";

const canvas = detailCanvas(40, 40, 20, 20);
/** spines around the shell, as angles from straight ahead */
const SPINES: readonly number[] = [-2.0, -2.5, -3.0, 2.6, 2.1];
/** veins creeping in from the rim of the eyeball, as a start and end in units of its radii */
const VEINS: readonly (readonly [number, number, number, number])[] = [
  [-0.95, 0.1, -0.55, 0.3],
  [-0.55, 0.3, -0.4, 0.05],
  [-0.8, 0.45, -0.5, 0.55],
  [0.92, -0.2, 0.6, -0.3],
  [0.6, -0.3, 0.5, -0.1],
];

/** whether this point of the eyeball, in units of its radii, lies on a vein */
function onVein(u: number, v: number, width: number): boolean {
  return VEINS.some(([u0, v0, u1, v1]) => {
    const du = u1 - u0;
    const dv = v1 - v0;
    const k = clamp(((u - u0) * du + (v - v0) * dv) / (du * du + dv * dv));
    return Math.hypot(u - u0 - du * k, v - v0 - dv * k) < width;
  });
}

/** how wide the lid is open: half shut while it drifts, with a slow blink, and wide open as it stares and fires */
function openness(e: Enemy, time: number): number {
  if (e.state === "wind" || e.state === "beam") return 1;
  if (e.state === "recover") return 0.25 + clamp(e.st / 0.6) * 0.35;
  return time % 3.7 < 0.12 ? 0.1 : 0.6;
}

/**
 * The wet eyeball, pixel by pixel inside the lid's opening: sclera lit from the top left and shadowed under the lid,
 * a dark iris ring around a crimson iris that glows brighter at its base, and a slit pupil that turns white hot as
 * it stares.
 */
function drawEyeball(
  s: SpriteCanvas,
  ex: number,
  ey: number,
  rx: number,
  ry: number,
  ix: number,
  iy: number,
  hot: boolean,
): void {
  const step = 1 / s.res;
  const showIris = ry > 0.8;
  const showVeins = ry >= 2.5;
  for (let v = -ry; v <= ry; v += step)
    for (let u = -rx; u <= rx; u += step) {
      const cu = u + step / 2;
      const cv = v + step / 2;
      const q = (cu / rx) ** 2 + (cv / ry) ** 2;
      if (q > 1) continue;
      const du = ex + cu - ix;
      const dv = ey + cv - iy;
      const di = Math.hypot(du, dv);
      let c: Color;
      if (showIris && Math.abs(du) < 0.5 && Math.abs(dv) < 1.4) c = hot ? AC.eyeHot : AC.pupil;
      else if (showIris && di < 1.75) c = dv > 0.5 || hot ? VOID[4] : VOID[3];
      else if (showIris && di < 2.4) c = di < 2 && dv > 0.8 ? VOID[3] : hot ? VOID[2] : AC.irisDeep;
      else if (showVeins && onVein(cu / rx, cv / ry, 0.25 / rx)) c = AC.vein;
      else if (cv < -ry + 0.7) c = AC.scleraShade;
      else if (q > 0.8 && cv > 0) c = AC.scleraDeep;
      else if (cv > ry * 0.4 || (q > 0.7 && cu > 0)) c = AC.scleraShade;
      else if (cu + cv < -rx * 0.35) c = AC.scleraLight;
      else c = AC.sclera;
      s.set(ex + u, ey + v, c);
    }
  if (!showVeins) return;
  // the wet specular glints: one art pixel high on the iris and a fleck below it
  block(s, ix - 1.5, iy - 1.5, 1, 1, AC.eyeHot);
  s.set(ix + 1, iy + 0.5, AC.scleraLight);
  s.set(ex - rx * 0.55, ey - ry * 0.35, AC.eyeHot);
}

/**
 * A floating eye in a spined shell of black chitin, nerve tendrils trailing beneath it, its wet eyeball turning to
 * follow Kael.
 */
export function drawEye(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const bob = Math.round(Math.sin(time * 2.4));
  const open = openness(e, time);
  const aim = e.state === "drift" ? Math.atan2(hero.y - 16 - e.y, hero.x - e.x) : e.ay;
  const lx = Math.cos(aim) * e.face;
  const ly = Math.sin(aim);
  const hot = e.state === "wind" || e.state === "beam";
  s.clear();
  // nerve tendrils trailing below and behind, each ending in a glowing bead
  s.begin();
  for (let k = 0; k < 4; k++) {
    const ox = -3 + k * 2;
    const w = Math.sin(time * 5 + k * 1.7) * 2;
    taper(s, [ox, 4 + bob], [ox - 2 + w * 0.5, 9 + bob], 0.95, 0.75, AC.bodyDark);
    taper(s, [ox - 2 + w * 0.5, 9 + bob], [ox - 4 + w, 13 + k + bob], 0.75, 0.45, AC.bodyDark);
  }
  s.shadeEdges(AC.bodyDark, AC.body, AC.bodyDeep);
  for (let k = 0; k < 4; k++) {
    const w = Math.sin(time * 5 + k * 1.7) * 2;
    block(s, -3 + k * 2 - 4 + w, 13 + k + bob, 1, 1, AC.rimSoft);
    s.set(-3 + k * 2 - 4 + w, 13 + k + bob, AC.rim);
  }
  s.commit(false);
  // the spines, thinning to points, behind the shell
  s.begin();
  for (const a of SPINES) {
    const len = Math.abs(a) > 2.6 ? 12.5 : 10.5;
    taper(
      s,
      [Math.cos(a) * 5, Math.sin(a) * 5 + bob],
      [Math.cos(a) * len, Math.sin(a) * len + bob],
      1.3,
      0.35,
      AC.plate,
    );
  }
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
  s.commit();
  // the shell of black flesh, lit from the top left and shadowed underneath
  s.begin();
  s.dot(-1, bob, 7.6, AC.body);
  s.shadeEdges(AC.body, AC.sheen, AC.bodyDark, 3);
  s.commit();
  // a chitin cap over the crown, with a seam and a glint on its ridge
  s.begin();
  s.dot(-2.5, -2.5 + bob, 4.4, AC.plate);
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark, 2);
  s.stroke(-5.5, -0.5 + bob, -1.5, -5 + bob, 0.25, AC.plateDark);
  block(s, -4.5, -5 + bob, 1, 0.5, AC.plateGlint);
  s.commit();
  // the eye itself, set into the front of the shell
  s.begin();
  const ex = 3;
  const ey = bob + 0.5;
  const rx = 5.8;
  const ry = Math.max(0.6, 5 * open);
  const ix = ex + lx * 1.6;
  const iy = ey + ly * Math.min(1.5, Math.max(0, ry - 1.5));
  drawEyeball(s, ex, ey, rx, ry, ix, iy, hot);
  s.commit();
  // the lids, a heavy plated one above and a dark fold below
  s.begin();
  const lid = (sign: number, r: number, c: Color) => {
    let prev: [number, number] | null = null;
    for (let x = -rx; x <= rx + 0.01; x += 0.5) {
      const p: [number, number] = [ex + x, ey + sign * (ry * Math.sqrt(Math.max(0, 1 - (x / rx) ** 2)) + r * 0.6)];
      if (prev) s.stroke(prev[0], prev[1], p[0], p[1], r, c);
      prev = p;
    }
  };
  lid(-1, 0.65, AC.plate);
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
  lid(1, 0.5, AC.bodyDark);
  s.commit();
  // a hooked spur at the front of the upper lid
  s.begin();
  fang(s, [ex + rx - 0.5, ey - ry - 0.6], [ex + rx + 1.6, ey - ry + 0.4], 1.1, AC.plate);
  s.shadeEdges(AC.plate, AC.plateLight, AC.plateDark);
  s.commit();
  rimBand(s, AC.rim);
  rimLight(s, AC.rim);
  s.outline(AC.outline);
  return s;
}
