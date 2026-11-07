import { JADE, SABLE_SKIN } from "../../../../constants/characters/sable/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Color } from "../../../../types/color";
import { hex, WHITE } from "../../../../utils/color";
import { fill } from "../parts";
import { seg } from "../ysra/parts";

/** Small drawing parts for Sable's 16 x 16 icons: bolts, her crossbow, snares, boots and foes. */
type S = SpriteCanvas;
export const SC = SABLE_SKIN.colors;
const STEEL = hex("#8a9aa0");

/** a bolt from the fletching at (x0, y0) to the head at (x1, y1) */
export function bolt(s: S, x0: number, y0: number, x1: number, y1: number, bright = false): void {
  const L = Math.hypot(x1 - x0, y1 - y0) || 1;
  const ux = (x1 - x0) / L;
  const uy = (y1 - y0) / L;
  fill(s, () => {
    seg(s, x0, y0, x1 - ux * 2, y1 - uy * 2, bright ? JADE[4] : SC.hilt);
    s.set(Math.round(x0 - uy), Math.round(y0 + ux), JADE[3]);
    s.set(Math.round(x0 + uy), Math.round(y0 - ux), JADE[2]);
    s.set(Math.round(x1 - ux), Math.round(y1 - uy), JADE[5]);
    s.set(Math.round(x1), Math.round(y1), WHITE);
  });
}

/** the crossbow side on, its nose at (x, y) facing right */
export function crossbow(s: S, x: number, y: number): void {
  fill(s, () => {
    seg(s, x - 10, y + 1, x, y, SC.hilt);
    seg(s, x - 10, y + 2, x - 6, y + 1, SC.hilt);
    seg(s, x - 7, y - 1, x - 4, y - 1, SC.coatLight);
  });
  fill(s, () => {
    seg(s, x, y - 4, x + 1, y, SC.blade);
    seg(s, x + 1, y, x, y + 4, SC.bladeBack);
  });
  fill(s, () => {
    seg(s, x, y - 4, x - 3, y, SC.trimLight);
    seg(s, x - 3, y, x, y + 4, SC.trimLight);
  });
}

/** an open snare lying on the floor, centered on x */
export function snare(s: S, x: number, y: number, plate: Color = SC.scarfLight): void {
  fill(s, () => {
    seg(s, x - 6, y, x + 6, y, STEEL);
    for (let i = -6; i <= 6; i += 2) s.set(x + i, y - 1, WHITE);
  });
  fill(s, () => {
    seg(s, x - 1, y - 1, x + 1, y - 1, plate);
  });
}

/** a boot, the sole facing right, its heel at (x, y) */
export function boot(s: S, x: number, y: number): void {
  fill(s, () => {
    s.poly(
      [
        [x, y - 6],
        [x + 3, y - 6],
        [x + 3, y - 2],
        [x + 7, y - 2],
        [x + 7, y + 1],
        [x, y + 1],
      ],
      SC.bootLight,
    );
  });
  fill(s, () => {
    seg(s, x + 7, y - 2, x + 7, y + 1, SC.trim);
  });
}

const WOOD = hex("#7a4e2c");
const BAND = hex("#5a6468");
const ROPE = hex("#c8b48a");
const FEATHER = hex("#8a5a34");
const FUR = hex("#6a5a4a");
const STRAW = hex("#d8b860");

/** a powder keg standing on its end, its foot at (x, y) */
export function keg(s: S, x: number, y: number): void {
  fill(s, () => {
    s.poly(
      [
        [x - 3, y],
        [x + 3, y],
        [x + 4, y - 3],
        [x + 3, y - 7],
        [x - 3, y - 7],
        [x - 4, y - 3],
      ],
      WOOD,
    );
  });
  fill(s, () => {
    seg(s, x - 4, y - 2, x + 4, y - 2, BAND);
    seg(s, x - 4, y - 5, x + 4, y - 5, BAND);
  });
}

/** a net cast over a span, from x0 to x1 with its foot at y */
export function net(s: S, x0: number, x1: number, y: number, h: number): void {
  fill(s, () => {
    for (let i = 0; i <= 3; i++)
      seg(s, x0 + ((x1 - x0) * i) / 3, y, x0 + 2 + ((x1 - x0 - 4) * (3 - i)) / 3, y - h, ROPE);
    seg(s, x0 + 1, y - h / 2, x1 - 1, y - h / 2, ROPE);
  });
}

/** a hawk with its wings spread, at (x, y) */
export function hawk(s: S, x: number, y: number): void {
  fill(s, () => {
    seg(s, x - 5, y - 2, x, y, FEATHER);
    seg(s, x + 5, y - 2, x, y, FEATHER);
    seg(s, x, y - 1, x, y + 2, SC.trimLight);
  });
}

/** a hound side on, facing right, its feet at (x, y) */
export function hound(s: S, x: number, y: number): void {
  fill(s, () => {
    seg(s, x - 5, y - 4, x + 2, y - 4, FUR);
    seg(s, x + 2, y - 5, x + 5, y - 6, FUR);
    seg(s, x - 4, y - 4, x - 5, y, FUR);
    seg(s, x + 1, y - 4, x + 2, y, FUR);
    seg(s, x - 5, y - 4, x - 7, y - 6, FUR);
  });
}

/** a straw decoy in a pine hood, its foot at (x, y) */
export function decoy(s: S, x: number, y: number): void {
  fill(s, () => {
    seg(s, x, y, x, y - 10, STRAW);
    seg(s, x - 4, y - 7, x + 4, y - 7, STRAW);
  });
  fill(s, () =>
    s.poly(
      [
        [x - 3, y - 3],
        [x + 3, y - 3],
        [x + 2, y - 9],
        [x, y - 12],
        [x - 2, y - 9],
      ],
      SC.coat,
    ),
  );
}
