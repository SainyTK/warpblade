import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { RAY_COLORS as C } from "./colors";
import { body, farWing, head, nearWing, type Turn, tail } from "./drawBody";
import { staticShell } from "./drawShell";
import { rayPose } from "./pose";

const canvas = detailCanvas(80, 52, 46, 26);

const turner =
  (tilt: number): Turn =>
  (x, y) => {
    const c = Math.cos(tilt);
    const sn = Math.sin(tilt);
    return [x * c - y * sn, x * sn + y * c];
  };

export function drawThunderray(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = rayPose(e, t);
  const turn = turner(p.tilt);
  s.clear();
  tail(s, turn, p, time);
  farWing(s, turn, p);
  body(s, turn, p, time);
  head(s, turn, p, time);
  nearWing(s, turn, p, time);
  s.outline(C.outline);
  if (p.charge > 0 && e.state === "volley") staticShell(s, p.charge, t);
  return s;
}
