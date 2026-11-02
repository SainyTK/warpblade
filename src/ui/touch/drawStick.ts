import { hex, mix } from "../../utils/color";
import type { PixelCanvas } from "./pixelCanvas";

const INK = hex("#0a0612");
const FILL = hex("#15122a");
const MIST = hex("#9a94c4");
const CRYSTAL = hex("#7fe3ff");
const BRASS = hex("#e0ac48");
const WHITE = hex("#ffffff");
/** the rim's run marks, at the far left and right, as parts of a turn either side of the middle */
const RUN_ARC = 0.07;

/** whether a clock angle lies within `within` of the clock angle `at` */
const nearAngle = (angle: number, at: number, within: number): boolean =>
  Math.abs(((angle - at + 1.5) % 1) - 0.5) < within;

/**
 * The stick's base: a see-through ring with arrow notches up and down, and brass marks at the sides
 * where a push turns a walk into a run.
 */
export function drawStickBase(canvas: PixelCanvas): void {
  const R = canvas.size / 2;
  canvas.clear();
  canvas.each((x, y, r, angle) => {
    if (r > R) return;
    if (r > R - 1) return canvas.put(x, y, INK, 0.75);
    if (r > R - 2) {
      const run = nearAngle(angle, 0.25, RUN_ARC) || nearAngle(angle, 0.75, RUN_ARC);
      return canvas.put(x, y, run ? BRASS : MIST, run ? 0.85 : 0.6);
    }
    if (r > R - 3) return canvas.put(x, y, INK, 0.5);
    canvas.put(x, y, FILL, 0.35);
  });
  const c = Math.floor(R);
  for (let i = 0; i < 3; i++)
    for (let k = -i - 1; k <= i; k++) {
      canvas.put(c + k, 4 + i, MIST, 0.8);
      canvas.put(c + k, canvas.size - 5 - i, MIST, 0.8);
    }
  canvas.flush();
}

/** the knob: a crystal disc with a highlight, brass while the push is a run */
export function drawStickKnob(canvas: PixelCanvas, running: boolean): void {
  const R = canvas.size / 2;
  const body = running ? BRASS : CRYSTAL;
  canvas.clear();
  canvas.each((x, y, r, angle) => {
    if (r > R) return;
    if (r > R - 1) return canvas.put(x, y, INK, 0.9);
    const lit = r > R - 2.5 && (angle > 0.625 || angle < 0.125);
    const deep = r > R - 2.5 && angle > 0.125 && angle < 0.625;
    const color = lit ? mix(body, WHITE, 0.55) : deep ? mix(body, INK, 0.45) : mix(body, FILL, 0.25);
    canvas.put(x, y, color, 0.85);
  });
  canvas.flush();
}
