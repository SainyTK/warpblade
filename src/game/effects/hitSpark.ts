import { HIT_SPARK } from "../../constants/hitFeel";
import { fleck, place, polygon } from "../../engine/frame";
import type { Ramp } from "../../types/color";
import type { Effect } from "../../types/effect";
import { WHITE } from "../../utils/color";
import { ease } from "../../utils/math";
import { fxRng } from "../state";

type Point = [number, number];

const blade: Point[] = [
  [0, 0],
  [0, 0],
  [0, 0],
  [0, 0],
];

function spindle(x: number, y: number, angle: number, back: number, front: number, width: number): Point[] {
  const cx = Math.cos(angle);
  const cy = Math.sin(angle);
  const mid = (front + back) * 0.3 - back;
  blade[0][0] = x - cx * back;
  blade[0][1] = y - cy * back;
  blade[1][0] = x + cx * mid - cy * width;
  blade[1][1] = y + cy * mid + cx * width;
  blade[2][0] = x + cx * front;
  blade[2][1] = y + cy * front;
  blade[3][0] = x + cx * mid + cy * width;
  blade[3][1] = y + cy * mid - cx * width;
  return blade;
}

export function createHitSpark(x: number, y: number, dir: number, size: number, sparks: Ramp): Effect {
  const angle = (dir < 0 ? Math.PI : 0) + fxRng.range(-HIT_SPARK.tilt, HIT_SPARK.tilt);
  const crossAngle = angle + Math.PI / 2 + fxRng.range(-0.3, 0.3);
  const length = HIT_SPARK.length * size;
  const width = HIT_SPARK.width * size;
  let t = HIT_SPARK.open;
  return {
    update(dt) {
      t += dt;
      return t < HIT_SPARK.life;
    },
    draw() {
      place();
      const u = t / HIT_SPARK.life;
      const open = ease.outCubic(Math.min(1, t / HIT_SPARK.open));
      const thin = 1 - u ** 3;
      const reach = length * open * (1 + 0.25 * u);
      const back = reach * HIT_SPARK.back;
      const w = width * thin;
      if (w < 0.3) return;
      polygon(spindle(x, y, angle, back, reach, w + 0.8), sparks[3], 0.9);
      polygon(spindle(x, y, angle, back, reach, w), sparks[2]);
      polygon(spindle(x, y, angle, back * 0.6, reach * 0.75, w * 0.5), sparks[1]);
      if (u < 0.5) polygon(spindle(x, y, angle, back * 0.4, reach * 0.55, w * 0.22), WHITE);
      const cross = reach * HIT_SPARK.cross;
      polygon(spindle(x, y, crossAngle, cross, cross, w * 0.55), sparks[2], thin);
      polygon(spindle(x, y, crossAngle, cross * 0.7, cross * 0.7, w * 0.25), sparks[1], thin);
      fleck(x + Math.cos(angle) * (reach + 1.5), y + Math.sin(angle) * (reach + 1.5), sparks[2], thin * 1.5);
    },
  };
}
