import { COIN_GOLD, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { fill } from "../parts";

/** the gold four-point star in the top right corner that marks an evolved skill, with a white centre */
export function evolvedStar(s: SpriteCanvas): void {
  fill(s, () => s.pixels(["..g..", "..g..", "ggwgg", "..g..", "..g.."], { g: COIN_GOLD[3], w: WHITE }, 10, 1));
}

/** an ice spike rising from the floor at x */
export function spike(s: SpriteCanvas, x: number, h: number, w: number): void {
  fill(s, () => {
    s.poly(
      [
        [x - w, 14],
        [x, 14],
        [x, 14 - h],
      ],
      PAL.ice[4],
    );
    s.poly(
      [
        [x, 14],
        [x + w, 14],
        [x, 14 - h],
      ],
      PAL.ice[2],
    );
    s.set(x, 14 - h + 1, WHITE);
  });
}

/** a dark storm cloud with a lit rim and underside */
export function cloud(s: SpriteCanvas): void {
  fill(s, () =>
    s.pixels(
      ["..rr..rrr....", ".rbbrrbbbr...", ".rbbbbbbbbrr.", "rbbbbbbbbbbbr", "rbbbbbbbbbbbr", ".lllllllllll."],
      { r: PAL.volt[2], b: PAL.volt[0], l: PAL.volt[3] },
      1,
      5,
    ),
  );
}

/** a foe's round body at (x, y) */
export function foeBody(
  s: SpriteCanvas,
  x: number,
  y: number,
  r: number,
  body = PAL.shadow[3],
  eye = PAL.shadow[5],
): void {
  fill(s, () => s.dot(x, y, r, body));
  fill(s, () => s.set(Math.round(x - r * 0.4), Math.round(y - r * 0.3), eye));
}

/** the floor line along the bottom */
export function ground(s: SpriteCanvas, c = PAL.crystal[2]): void {
  fill(s, () => s.stroke(1, 14.5, 15, 14.5, 0.6, c));
}
