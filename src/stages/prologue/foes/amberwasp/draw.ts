import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import { DAY_COLORS as DC } from "../../../../game/enemies/day/colors";
import type { Enemy } from "../../../../types/enemy";
import { waspBody } from "./drawBody";
import { type Place, wings } from "./drawWings";
import { waspPose } from "./pose";

const canvas = detailCanvas(48, 46, 24, 23);

export function drawAmberwasp(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const p = waspPose(e, t);
  const c = Math.cos(p.tilt);
  const n = Math.sin(p.tilt);
  const at: Place = (x, y) => [x * c - y * n, x * n + y * c + p.bob];
  s.clear();
  waspBody(s, at, p.curl, p.heat);
  s.outline(DC.outline);
  wings(s, at, (p.flap + 1) % 3, 0.7);
  wings(s, at, p.flap, 1);
  return s;
}
