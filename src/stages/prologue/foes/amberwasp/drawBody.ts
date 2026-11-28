import type { SpriteCanvas } from "../../../../engine/sprite";
import { DAY_COLORS as DC } from "../../../../game/enemies/day/colors";
import { glowEye } from "../../../../game/enemies/day/paint";
import { WHITE } from "../../../../utils/color";
import { lerp } from "../../../../utils/math";
import { WASP_COLORS as WC } from "./colors";
import type { Place } from "./drawWings";

const A = WC.amber;
const D = WC.band;
const WAIST: readonly [number, number] = [-1.6, 0.4];
const ABDOMEN = 10;

function abdomen(s: SpriteCanvas, at: Place, curl: number, heat: number): void {
  const a = lerp(2.95, 1.2, curl);
  const ux = Math.cos(a);
  const uy = Math.sin(a);
  const tip = [WAIST[0] + ux * ABDOMEN, WAIST[1] + uy * ABDOMEN] as const;
  const [x0, y0] = at(WAIST[0] + ux * 1.5, WAIST[1] + uy * 1.5);
  const [x1, y1] = at(tip[0], tip[1]);
  s.begin();
  s.taper(x0, y0, x1, y1, 3.4, 1.3, A[2], curl * 0.8);
  s.shadeEdges(A[2], A[3], A[1], 2);
  for (const u of [0.32, 0.55, 0.76]) {
    const r = 3.2 - u * 1.9;
    const cx = WAIST[0] + ux * (1.5 + (ABDOMEN - 1.5) * u);
    const cy = WAIST[1] + uy * (1.5 + (ABDOMEN - 1.5) * u);
    const [bx0, by0] = at(cx - uy * r, cy + ux * r);
    const [bx1, by1] = at(cx + uy * r, cy - ux * r);
    s.stroke(bx0, by0, bx1, by1, 0.55, D[1]);
  }
  const [gx, gy] = at(WAIST[0] + ux * 4 - uy * 2.2, WAIST[1] + uy * 4 + ux * 2.2);
  s.set(gx, gy, A[4]);
  s.commit();
  const [sx, sy] = at(tip[0] + ux * 3.2, tip[1] + uy * 3.2);
  s.begin();
  s.taper(x1, y1, sx, sy, 0.8, 0.25, heat > 0.5 ? WC.sting[1] : D[1]);
  s.set(sx, sy, heat > 0.2 ? WC.sting[2] : DC.thorn);
  if (heat > 0.6) s.set(sx - ux * 0.5, sy - uy * 0.5, WHITE);
  s.commit();
}

function legs(s: SpriteCanvas, at: Place, curl: number): void {
  s.begin();
  for (const [hx, fx] of [
    [3.5, 5],
    [2, 2.5],
    [0.5, -0.5],
  ] as const) {
    const [ax, ay] = at(hx, 1.8);
    const [kx, ky] = at(hx + 1, 4);
    const [bx, by] = at(fx - curl, 6.2);
    s.hairline(ax, ay, kx, ky, D[0]);
    s.hairline(kx, ky, bx, by, D[1]);
  }
  s.commit(false);
}

function thorax(s: SpriteCanvas, at: Place): void {
  const [cx, cy] = at(2, -0.6);
  s.begin();
  s.dot(cx, cy, 3.2, D[1]);
  s.shadeEdges(D[1], D[2], D[0], 2);
  const [mx, my] = at(2.4, -2.6);
  s.dot(mx, my, 1, A[2]);
  s.set(mx - 0.5, my - 0.5, A[4]);
  const [wx, wy] = at(WAIST[0], WAIST[1]);
  s.dot(wx, wy, 0.9, D[1]);
  s.commit();
}

function head(s: SpriteCanvas, at: Place, heat: number): void {
  const [hx, hy] = at(6.8, -0.8);
  s.begin();
  s.dot(hx, hy, 2.6, A[2]);
  s.shadeEdges(A[2], A[3], A[1], 2);
  const [ex, ey] = at(7.4, -1.5);
  s.dot(ex, ey, 1.5, DC.crackDeep);
  glowEye(s, ex, ey - 0.5, heat > 0.5 ? DC.crackHot : DC.crack, heat > 0.5 ? WHITE : DC.eye);
  const [jx, jy] = at(9.2, 0.8);
  const [kx, ky] = at(8.4, 1.8);
  s.hairline(jx, jy, kx, ky, D[0]);
  s.commit();
  s.begin();
  const [r0x, r0y] = at(7.2, -3);
  const [r1x, r1y] = at(9.4, -6);
  const [r2x, r2y] = at(11.6, -5.4);
  s.hairline(r0x, r0y, r1x, r1y, D[1]);
  s.hairline(r1x, r1y, r2x, r2y, D[1]);
  s.set(r2x, r2y, A[3]);
  s.commit(false);
}

export function waspBody(s: SpriteCanvas, at: Place, curl: number, heat: number): void {
  legs(s, at, curl);
  abdomen(s, at, curl, heat);
  thorax(s, at);
  head(s, at, heat);
}
