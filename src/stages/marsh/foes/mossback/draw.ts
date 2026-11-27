import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { SNAPPER as C } from "./colors";
import { drawHead } from "./drawHead";
import { drawShell } from "./drawShell";
import { type SnapperPose, snapperPose } from "./pose";

const canvas = detailCanvas(100, 52, 46, 44);
const LEGS = [
  [-9, 1],
  [7, -1],
] as const;

function leg(s: SpriteCanvas, x: number, base: number, p: SnapperPose, phase: number, near: boolean): void {
  const side = x > 0 ? 1 : -1;
  const out = side * (1.2 + p.splay * 2.5);
  const swing = p.step * phase * 1.4;
  const lift = Math.max(0, p.step * phase) * 0.8;
  const footX = x + out + swing;
  const footY = -p.tuck * 3.5 - lift;
  const color = near ? C.skin : C.skinDark;
  s.taper(x, base - 2.5, footX, footY - 1.4, 2.2, 1.7, color, side * 0.8);
  s.stroke(footX - 1.2, footY - 0.7, footX + 1.6, footY - 0.7, 1, color);
  for (let i = 0; i < 3; i++) s.set(footX + 2.4 - i * 1.1, footY + 0.1, C.claw);
}

function tail(s: SpriteCanvas, base: number, time: number): void {
  const wag = Math.sin(time * 2) * 0.6;
  s.taper(-13, base - 2, -18, base + wag, 1.6, 0.4, C.skinDark, 0.5);
}

export function drawMossback(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = snapperPose(e, t);
  const base = -4 + p.sink - p.tuck * 2;
  s.clear();
  s.shift(p.rattle, 0);
  s.begin();
  tail(s, base, time);
  leg(s, LEGS[0][0] + 3, base, p, -LEGS[0][1], false);
  leg(s, LEGS[1][0] - 3, base, p, -LEGS[1][1], false);
  s.shadeEdges(C.skinDark, C.skin, C.skinDeep);
  s.commit();
  if (!p.hidden) drawHead(s, base, p);
  drawShell(s, base - 1, p.glow, time);
  s.begin();
  leg(s, LEGS[0][0], base, p, LEGS[0][1], true);
  leg(s, LEGS[1][0], base, p, LEGS[1][1], true);
  s.shadeEdges(C.skin, C.skinLight, C.skinDark, 2);
  s.commit();
  s.outline(C.shellDeep);
  return s;
}
