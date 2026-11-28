import { detailCanvas, type SpriteCanvas } from "../../../../engine/sprite";
import type { Enemy } from "../../../../types/enemy";
import { WASP } from "./colors";
import { abdomen, legs, thorax } from "./drawBody";
import { bulb, stalk, wing } from "./drawFungus";
import { waspPose } from "./pose";

const canvas = detailCanvas(52, 48, 26, 26);

export function drawCordywasp(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const time = t + e.seed;
  const p = waspPose(e, time);
  const shiver = p.swell > 0 ? Math.sin(time * 60) * p.swell * 0.4 : 0;
  s.clear();
  s.shift(shiver, Math.round(Math.sin(time * 9) * 0.5 * 2) / 2);
  wing(s, !p.wingUp, false);
  legs(s, time);
  abdomen(s, p);
  thorax(s, p, time);
  stalk(s, time);
  bulb(s, p, time);
  s.outline(WASP.outline);
  wing(s, p.wingUp, true);
  return s;
}
