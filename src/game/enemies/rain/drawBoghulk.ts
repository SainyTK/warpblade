import { detailCanvas, type SpriteCanvas } from "../../../engine/sprite";
import type { Enemy } from "../../../types/enemy";
import { RAIN_FOES as C } from "./colors";
import { type HulkLook, hulkLook } from "./hulkLook";
import { lying } from "./hulkMoves";
import { drawSlidePose } from "./hulkSlidePose";
import { drawStandingHulk } from "./hulkStanding";

const canvas = detailCanvas(100, 66, 50, 60);
const FLOOR_CLIP = 0.5;
const POOL = { width: 18, tall: 1.6 } as const;

function drawPool(s: SpriteCanvas, look: HulkLook): void {
  const rx = POOL.width * (0.5 + 0.5 * look.sunk);
  const points: [number, number][] = [];
  for (let i = 0; i <= 16; i++) {
    const a = Math.PI + (i / 16) * Math.PI;
    points.push([Math.cos(a) * rx, Math.sin(a) * POOL.tall + FLOOR_CLIP]);
  }
  s.begin();
  s.poly(points, C.puddle);
  s.shadeEdges(C.puddle, C.puddleLip, C.mudDeep);
  for (let x = -rx + 3; x < rx - 3; x += 5) s.set(x + Math.sin(look.time * 3 + x) * 0.5, -0.6, C.wetSky);
  s.commit();
}

export function drawBoghulk(e: Enemy, t: number): SpriteCanvas {
  const s = canvas;
  const look = hulkLook(e, t);
  s.clear();
  if (lying(e)) drawSlidePose(s, look, e.state === "lunge");
  else drawStandingHulk(s, look, e.state === "volley", e.state === "dive");
  if (look.drop > 0) s.clipBelow(FLOOR_CLIP);
  if (e.state === "burrow") drawPool(s, look);
  s.outline(C.outline);
  return s;
}
