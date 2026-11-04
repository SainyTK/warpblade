import { SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { hero } from "../../state";
import { AC, rimLight, VOID } from "./colors";

const canvas = new SpriteCanvas(40, 40, 20, 20);
/** spines around the shell, as angles from straight ahead */
const SPINES: readonly number[] = [-2.0, -2.5, -3.0, 2.6, 2.1];

/** how wide the lid is open: half shut while it drifts, with a slow blink, and wide open as it stares and fires */
function openness(e: Enemy, time: number): number {
  if (e.state === "wind" || e.state === "beam") return 1;
  if (e.state === "recover") return 0.25 + clamp(e.st / 0.6) * 0.35;
  return time % 3.7 < 0.12 ? 0.1 : 0.6;
}

/** a floating eye in a spined shell of black flesh, nerve tendrils trailing beneath it, its iris turning to follow Kael */
export function drawEye(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const bob = Math.round(Math.sin(time * 2.4));
  const open = openness(e, time);
  const aim = e.state === "drift" ? Math.atan2(hero.y - 16 - e.y, hero.x - e.x) : e.ay;
  const lx = Math.cos(aim) * e.face;
  const ly = Math.sin(aim);
  s.clear();
  // nerve tendrils trailing below and behind
  s.begin();
  for (let k = 0; k < 4; k++) {
    const ox = -3 + k * 2;
    const w = Math.sin(time * 5 + k * 1.7) * 2;
    s.stroke(ox, 4 + bob, ox - 2 + w * 0.5, 9 + bob, 1.1, AC.bodyDark);
    s.stroke(ox - 2 + w * 0.5, 9 + bob, ox - 4 + w, 13 + k + bob, 0.7, AC.bodyDark);
    s.set(ox - 4 + w, 13 + k + bob, AC.rimSoft);
  }
  s.commit(false);
  // the shell and its spines
  s.begin();
  for (const a of SPINES) {
    const len = Math.abs(a) > 2.6 ? 11 : 9;
    s.stroke(Math.cos(a) * 5, Math.sin(a) * 5 + bob, Math.cos(a) * len, Math.sin(a) * len + bob, 0.7, AC.body);
  }
  s.dot(-1, bob, 7.2, AC.body);
  s.dot(-2, -2 + bob, 4, AC.bodyLight);
  s.commit();
  // the eye itself, set into the front of the shell
  s.begin();
  const ex = 2;
  const ey = bob;
  const rx = 5.2;
  const ry = Math.max(0.6, 4.4 * open);
  for (let y = Math.floor(-ry); y <= Math.ceil(ry); y++)
    for (let x = Math.floor(-rx); x <= Math.ceil(rx); x++) {
      const q = ((x + 0.5) / rx) ** 2 + ((y + 0.5) / ry) ** 2;
      if (q <= 1) s.set(ex + x, ey + y, y > ry * 0.4 ? AC.scleraShade : AC.sclera);
    }
  if (open > 0.2) {
    s.set(ex - 4, ey, AC.vein);
    s.set(ex - 3, ey + 1, AC.vein);
    s.set(ex + 4, ey - 1, AC.vein);
    const ix = ex + Math.round(lx * 1.6);
    const iy = ey + Math.round(ly * Math.min(1.5, ry - 1.5));
    const hot = e.state === "wind" || e.state === "beam";
    // a dark iris ring, a crimson iris and a slit pupil that turns white hot as it stares
    for (let y = -2; y <= 2; y++)
      for (let x = -2; x <= 2; x++) {
        const q = x * x + y * y;
        if (q > 5 || Math.abs(y) > ry) continue;
        s.set(ix + x, iy + y, q > 3 ? VOID[2] : hot ? VOID[4] : VOID[3]);
      }
    for (let y = -1; y <= 1; y++) if (Math.abs(y) < ry) s.set(ix, iy + y, hot ? AC.eyeHot : AC.pupil);
    if (ry > 1.5) s.set(ix - 1, iy - 1, AC.eyeHot);
  }
  // the lids, heavy dark rims above and below
  for (let x = -4; x <= 4; x++) {
    const h = Math.round(ry * Math.sqrt(1 - (x / 5) ** 2));
    s.set(ex + x, ey - h - 1, AC.bodyLight);
    s.set(ex + x, ey + h + 1, AC.bodyDark);
  }
  s.commit();
  rimLight(s, AC.rim);
  s.outline(AC.outline);
  return s;
}
