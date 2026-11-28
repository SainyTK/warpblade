import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WHITE } from "../../../../utils/color";
import { SKY_FOES as C } from "../colors";
import { RAY as R } from "./colors";
import { type RayPose, rayPose } from "./pose";

const canvas = detailCanvas(72, 52, 36, 26);

type At = (x: number, y: number) => readonly [number, number];

function tail(s: SpriteCanvas, at: At, p: RayPose, time: number): void {
  let [lx, ly] = at(-6, 0.5);
  s.begin();
  for (let k = 1; k <= 10; k++) {
    const u = k / 10;
    const [nx, ny] = at(-6 - u * 22, 0.5 + Math.sin(time * 4 - u * 5) * 2.4 * u + p.whip * u * 3);
    s.stroke(lx, ly, nx, ny, 0.7 - u * 0.35, R.back[2]);
    lx = nx;
    ly = ny;
  }
  s.shadeEdges(R.back[2], R.back[3], R.back[1]);
  s.commit();
  s.begin();
  s.poly(
    [
      [lx + 1, ly],
      [lx - 2, ly - 1.6],
      [lx - 3.4, ly],
      [lx - 2, ly + 1.6],
    ],
    p.charge > 0.5 ? R.gill[4] : R.gill[3],
  );
  s.commit(false);
}

function wing(s: SpriteCanvas, at: At, p: RayPose, near: boolean): void {
  const side = near ? 1 : -1;
  const reach = 12 - p.curl * 3;
  const lift = p.flap * 6 * side;
  const base = near ? R.back[2] : R.back[1];
  const tip = at(-3 - p.curl * 3, side * reach - lift);
  const lead = at(2.5, side * reach * 0.62 - lift * 0.55);
  s.begin();
  s.poly([at(6, side * 1.2), lead, tip, at(-6.5, side * 4.5 - lift * 0.35), at(-8, side * 1.6)], base);
  s.shadeEdges(base, near ? R.back[3] : R.back[2], R.back[0], 2);
  const [rx, ry] = at(5, side * 1.6);
  s.hairline(rx, ry, lead[0], lead[1], near ? R.edge[2] : R.back[2]);
  s.hairline(lead[0], lead[1], tip[0], tip[1], near ? R.edge[2] : R.back[2]);
  for (let k = 1; k <= 2; k++) {
    const [sx, sy] = at(-1 - k * 2, side * 2);
    const [ex, ey] = at(-2 - k * 1.5, side * (reach * 0.55) - lift * 0.5);
    s.hairline(sx, sy, ex, ey, near ? R.back[1] : R.back[0]);
  }
  s.commit();
  if (near) {
    s.begin();
    s.set(tip[0], tip[1], p.charge > 0.5 ? WHITE : R.edge[3]);
    s.commit(false);
  }
}

function body(s: SpriteCanvas, at: At, p: RayPose): void {
  const [x0, y0] = at(-8, 0.4);
  const [x1, y1] = at(7, 0);
  s.begin();
  s.taper(x0, y0, x1, y1, 2.4, 3.4, R.back[3], 0.2);
  s.shadeEdges(R.back[3], R.back[4], R.back[1], 2);
  s.commit();
  s.begin();
  const [bx0, by0] = at(-5, 2.2);
  const [bx1, by1] = at(6, 2);
  s.taper(bx0, by0, bx1, by1, 0.9, 1.4, R.belly[2], 0);
  s.shadeEdges(R.belly[2], R.belly[3], R.belly[1]);
  s.commit();
  s.begin();
  for (let k = 0; k < 3; k++) {
    const [gx, gy] = at(1 - k * 1.6, 1.4);
    const [hx, hy] = at(1.4 - k * 1.6, 2.6);
    s.hairline(gx, gy, hx, hy, p.charge > 0.3 ? R.gill[4] : R.gill[3]);
  }
  s.commit(false);
  s.begin();
  for (const v of [-1.8, 1.8]) {
    const [hx, hy] = at(7, v);
    const [tx, ty] = at(11 - p.curl * 2, v * 1.4 + (v > 0 ? p.curl * 1.5 : 0));
    s.taper(hx, hy, tx, ty, 1, 0.4, R.back[3], v * 0.3);
  }
  s.shadeEdges(R.back[3], R.back[4], R.back[2]);
  s.commit();
  s.begin();
  const [ex, ey] = at(6, -1.2);
  s.block(ex - 0.5, ey - 0.5, p.charge > 0.5 ? WHITE : R.eye);
  s.commit(false);
}

export function drawZephyray(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = rayPose(e, time);
  const cos = Math.cos(p.tilt);
  const sin = Math.sin(p.tilt);
  const at: At = (x, y) => [x * cos - y * sin, x * sin + y * cos];
  s.clear();
  tail(s, at, p, time);
  wing(s, at, p, false);
  body(s, at, p);
  wing(s, at, p, true);
  s.outline(C.outline);
  return s;
}
