import { DANGER_GLOW } from "../constants/lowHealth";
import { dangerGlow } from "../game/lowHealth";
import { cb, cg, cr } from "../utils/color";
import { edgeWeight } from "../utils/danger";
import { byId } from "./dom";

/**
 * The red glow around the screen at low HP: a canvas over the stage and the backdrop around it, on the same art pixel
 * grid, under the HUD. Only the pixels the widest band can reach are kept and redrawn.
 */
const canvas = byId<HTMLCanvasElement>("dangerGlow");
const ctx = canvas.getContext("2d");
let image: ImageData | null = null;
/** the pixels within the widest band: their index, and their distance from the nearest side and the nearest top or bottom */
let cells = { index: new Int32Array(0), dx: new Float32Array(0), dy: new Float32Array(0) };
/** the edge opacity drawn last, so a frame that would draw the same picture is skipped */
let drawn = -1;

/** the glow covers the screen in art pixels: cols by rows, its top left corner this many CSS pixels from the stage's */
export function sizeDangerGlow(cols: number, rows: number, left: number, top: number, art: number): void {
  Object.assign(canvas.style, {
    left: `${left}px`,
    top: `${top}px`,
    width: `${art * cols}px`,
    height: `${art * rows}px`,
  });
  if (!ctx || (canvas.width === cols && canvas.height === rows && image)) return;
  canvas.width = cols;
  canvas.height = rows;
  image = ctx.createImageData(cols, rows);
  const c = DANGER_GLOW.color;
  for (let j = 0; j < image.data.length; j += 4) {
    image.data[j] = cr(c);
    image.data[j + 1] = cg(c);
    image.data[j + 2] = cb(c);
  }
  const reach = DANGER_GLOW.critical.band;
  const index: number[] = [];
  const dx: number[] = [];
  const dy: number[] = [];
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < cols; x++) {
      const ex = Math.min(x, cols - 1 - x) + 0.5;
      const ey = Math.min(y, rows - 1 - y) + 0.5;
      if (ex >= reach && ey >= reach) continue;
      index.push(y * cols + x);
      dx.push(ex);
      dy.push(ey);
    }
  cells = { index: Int32Array.from(index), dx: Float32Array.from(dx), dy: Float32Array.from(dy) };
  drawn = -1;
}

/** draw this frame's glow; nothing shows while it is faded out or the start menu is open */
export function drawDangerGlow(visible: boolean): void {
  if (!ctx || !image) return;
  const { alpha, band } = dangerGlow();
  const edge = visible ? Math.round(alpha * 255) : 0;
  if (edge === drawn && edge === 0) return;
  drawn = edge;
  canvas.hidden = edge === 0;
  if (edge === 0) return;
  const data = image.data;
  const { index, dx, dy } = cells;
  for (let k = 0; k < index.length; k++) data[index[k] * 4 + 3] = edge * edgeWeight(dx[k], dy[k], band);
  ctx.putImageData(image, 0, 0);
}
