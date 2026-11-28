import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { scale } from "../../../../utils/color";
import { FOE } from "../colors";
import { type BlotmothPose, blotmothPose } from "./pose";

const canvas = detailCanvas(34, 32, 17, 16);
const I = FOE.ink;
type Pt = [number, number];

function hindWing(s: SpriteCanvas, p: BlotmothPose, root: Pt, far: boolean): void {
  const lift = far ? p.flap * 0.85 - 0.25 : p.flap;
  const tone = far ? I[1] : I[2];
  const hx = root[0] - 3.5;
  const hy = root[1] + 2.5 - Math.sin(lift * 1.1) * 2.5;
  s.begin();
  s.poly(
    [
      [root[0], root[1] + 0.5],
      [hx - 2.5, hy - 1],
      [hx - 2, hy + 2],
      [root[0] - 1, root[1] + 2.5],
    ],
    tone,
  );
  s.dot(hx - 1, hy + 0.5, 1.9, tone);
  s.shadeEdges(tone, far ? I[2] : I[3], I[0]);
  s.commit();
}

function foreWing(s: SpriteCanvas, p: BlotmothPose, root: Pt, far: boolean, time: number): void {
  const lift = far ? p.flap * 0.85 - 0.25 : p.flap;
  const span = 8 * (0.45 + 0.55 * Math.abs(Math.cos(lift * 0.9)));
  const up = -Math.sin(lift * 1.1) * 7.5 - 1;
  const tone = far ? I[1] : I[2];
  const tip: Pt = [root[0] - span * 0.45, root[1] + up];
  const back: Pt = [root[0] - span, root[1] + up * 0.5 + 1];
  s.begin();
  s.poly([root, [tip[0] + 2.2, tip[1] + 0.2], tip, back, [root[0] - 2.5, root[1] + 1.5]], tone);
  s.dot(tip[0] + 0.3, tip[1] + 0.6, 1.9, tone);
  s.dot(back[0] + 1, back[1] - 0.3, 1.5, tone);
  s.shadeEdges(tone, far ? I[2] : I[4], I[0]);
  s.commit();
  if (far) return;
  s.begin();
  const spot: Pt = [(tip[0] + back[0]) / 2 + 1, (tip[1] + back[1]) / 2 + 0.3];
  s.dot(spot[0], spot[1], 1, FOE.paper[3]);
  s.set(spot[0], spot[1], p.hot ? FOE.letterHot : FOE.letter);
  s.hairline(root[0] - 0.5, root[1], tip[0] + 0.5, tip[1] + 1, I[3]);
  s.set(back[0] + 1.2, back[1] - 0.5, scale(FOE.paper[3], 0.8));
  const drip = 1 + Math.sin(time * 3) * 0.6;
  s.taper(back[0] + 1.5, back[1] + 1, back[0] + 1.3, back[1] + 2 + drip, 0.5, 0.25, tone);
  s.commit(false);
}

function body(s: SpriteCanvas, p: BlotmothPose, time: number): void {
  const c = Math.cos(p.pitch);
  const n = Math.sin(p.pitch);
  const at = (u: number, v: number): Pt => [u * c - v * n, u * n + v * c];
  s.begin();
  s.taper(...at(-5, 0.5), ...at(1, 0), 1, 1.8, FOE.paper[2]);
  s.shadeEdges(FOE.paper[2], FOE.paper[3], FOE.paper[1]);
  for (let u = -4; u < 0; u += 1.4) s.hairline(...at(u, -1), ...at(u, 1.2), FOE.paperShade);
  s.commit();
  s.begin();
  s.dot(...at(2.5, -0.3), 1.6, I[1]);
  s.shadeEdges(I[1], I[3], I[0]);
  s.commit();
  s.begin();
  const sway = Math.sin(time * 5) * 0.4;
  s.hairline(...at(3, -1.5), ...at(5, -4 + sway), FOE.paper[2]);
  s.hairline(...at(2.2, -1.6), ...at(3.4, -4.6 + sway), FOE.paper[1]);
  s.set(...at(5, -4 + sway), FOE.paper[4]);
  const [ex, ey] = at(3.2, -0.5);
  if (p.dazed) s.hairline(ex - 0.5, ey, ex + 0.5, ey, FOE.eyeDeep);
  else {
    s.set(ex, ey, p.hot ? FOE.eyeHot : FOE.eye);
    s.set(ex - 0.5, ey, p.hot ? FOE.eye : FOE.eyeDeep);
  }
  s.commit(false);
}

export function drawBlotmoth(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = blotmothPose(e, time);
  const bob = Math.round(Math.sin(time * 9) * 0.8 * 2) / 2;
  s.clear();
  s.shift(0, bob);
  hindWing(s, p, [0.5, -0.5], true);
  foreWing(s, p, [0.5, -0.5], true, time);
  body(s, p, time);
  hindWing(s, p, [-0.5, 0], false);
  foreWing(s, p, [-0.5, 0], false, time);
  s.shift(0, 0);
  s.outline(FOE.outline);
  return s;
}
