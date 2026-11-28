import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { GNAT } from "./colors";
import { type GnatPose, gnatPose } from "./pose";

type Pt = readonly [number, number];
const canvas = detailCanvas(26, 24, 13, 12);
const S = GNAT.shell;

const rotate =
  (a: number) =>
  ([x, y]: Pt): Pt => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];

function wing(s: SpriteCanvas, p: GnatPose, back: boolean): void {
  const lift = p.wing * (back ? 1 : 0.8);
  const root: Pt = [back ? -0.5 : 0.5, -2];
  const tip: Pt = [root[0] - 4.5, root[1] - 3.6 - lift * 2.6];
  const edge: Pt = [root[0] - 5.2, root[1] - 0.6 - lift * 1.4];
  s.begin();
  s.poly([root, tip, edge], back ? GNAT.wing[1] : GNAT.wing[3]);
  s.commit(false);
  s.begin();
  s.hairline(root[0], root[1], tip[0], tip[1], back ? GNAT.wing[2] : GNAT.wing[4]);
  s.hairline(tip[0], tip[1], edge[0], edge[1], GNAT.wing[2]);
  s.commit(false);
}

function sac(s: SpriteCanvas, p: GnatPose, time: number, turn: (q: Pt) => Pt): void {
  const pulse = 0.25 * Math.sin(time * 6) + p.glow * 0.6;
  const [cx, cy] = turn([-3, 0.6]);
  s.begin();
  s.dot(cx, cy, 2.9 + pulse * 0.4, GNAT.sac[1]);
  s.shadeEdges(GNAT.sac[1], GNAT.sac[2], GNAT.sac[0], 1);
  s.commit();
  s.begin();
  const [hx, hy] = turn([-3.8, -0.4]);
  s.block(hx - 0.5, hy - 0.5, p.glow > 0.5 ? GNAT.sac[4] : GNAT.sac[3], 1);
  s.set(cx + 0.5, cy + 1.4, GNAT.vein[1]);
  s.set(cx - 1.2, cy + 1, GNAT.vein[1]);
  const [tx, ty] = turn([-6, 1.4]);
  s.set(tx, ty, GNAT.sac[2]);
  s.commit(false);
}

function thorax(s: SpriteCanvas, p: GnatPose, turn: (q: Pt) => Pt): void {
  const [cx, cy] = turn([0.6, -0.4]);
  const [hx, hy] = turn([3, -0.8]);
  s.begin();
  s.dot(cx, cy, 1.9, S[2]);
  s.dot(hx, hy, 1.6, S[1]);
  s.shadeEdges(S[2], S[4], S[0]);
  s.commit();
  s.begin();
  s.block(hx + 0.2, hy - 0.9, p.glow > 0.4 ? GNAT.eyeHot : GNAT.eye[3], 1);
  s.set(hx + 0.6, hy - 0.9, GNAT.eye[4]);
  const [px, py] = turn([4.6, 0.2]);
  s.hairline(hx + 0.8, hy + 0.4, px, py + 1.2, S[3]);
  s.commit(false);
}

function legs(s: SpriteCanvas, p: GnatPose, time: number, turn: (q: Pt) => Pt): void {
  s.begin();
  for (let i = 0; i < 3; i++) {
    const dangle = p.tumble ? Math.sin(time * 30 + i) * 1 : 0;
    const [x0, y0] = turn([1.4 - i * 1.1, 0.8]);
    const [x1, y1] = turn([1.8 - i * 1.6 + dangle, 3 + (i % 2) * 0.6]);
    s.hairline(x0, y0, x1, y1, S[1]);
  }
  s.commit(false);
}

export function drawSporegnat(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = gnatPose(e, time);
  const turn = rotate(p.tumble ? time * 9 : p.pitch);
  s.clear();
  wing(s, p, true);
  legs(s, p, time, turn);
  sac(s, p, time, turn);
  thorax(s, p, turn);
  s.outline(GNAT.outline);
  wing(s, p, false);
  return s;
}
