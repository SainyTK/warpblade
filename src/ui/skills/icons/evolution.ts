import { COIN_GOLD, FIRE_RAMP, KAEL_COLORS as HC, PAL } from "../../../constants/palette";
import { RITE_RAMP } from "../../../constants/ysra/emberLook";
import type { SpriteCanvas } from "../../../engine/sprite";
import { WHITE } from "../../../utils/color";
import { bolt, drop, fill, flame } from "./parts";
import { floor, seg } from "./ysra/parts";

/** the gold four-point star in the top right corner that marks an evolved spell, with a white centre */
export function evolvedStar(s: SpriteCanvas): void {
  fill(s, () => s.pixels(["..g..", "..g..", "ggwgg", "..g..", "..g.."], { g: COIN_GOLD[3], w: WHITE }, 10, 1));
}

/** an ice spike rising from the floor at x */
function spike(s: SpriteCanvas, x: number, h: number, w: number): void {
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

/** a flame column standing on the floor at x: the Flame Pillar icon's outer and inner shapes, scaled to height h */
function column(s: SpriteCanvas, x: number, h: number, w: number): void {
  fill(s, () =>
    s.poly(
      [
        [x - w, 15],
        [x + w, 15],
        [x + w * 0.7, 15 - h * 0.75],
        [x, 15 - h],
        [x - w * 0.7, 15 - h * 0.75],
      ],
      RITE_RAMP[3],
    ),
  );
  fill(s, () => {
    s.poly(
      [
        [x - w * 0.5, 15],
        [x + w * 0.5, 15],
        [x + w * 0.35, 15 - h * 0.65],
        [x, 15 - h * 0.85],
        [x - w * 0.35, 15 - h * 0.65],
      ],
      RITE_RAMP[5],
    );
    seg(s, x, 14, x, 15 - h * 0.45, WHITE);
  });
}

/** Evolution icons: each base spell's marks grown bigger, with a gold star */
export const EVOLUTION_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a big flask with three small flames around it */
  e_sunflask: (s) => {
    drop(s, 8, 10.5, 4.2, FIRE_RAMP[3], FIRE_RAMP[1]);
    fill(s, () => s.stroke(8, 2, 8, 4.5, 1, HC.trim));
    flame(s, 2.5, 8, 6);
    flame(s, 2.5, 15.5, 5.5);
    flame(s, 13.5, 15.5, 6);
    evolvedStar(s);
  },
  /** a tall spire between two short spikes */
  e_glacier: (s) => {
    spike(s, 3.5, 6, 2);
    spike(s, 12.5, 6, 2);
    spike(s, 8, 13, 3);
    fill(s, () => s.stroke(1, 14.5, 15, 14.5, 0.7, PAL.ice[2]));
    evolvedStar(s);
  },
  /** a dark storm cloud with a lit rim and underside, and a bolt under it */
  e_thunderhead: (s) => {
    fill(s, () =>
      s.pixels(
        ["..rr..rrr....", ".rbbrrbbbr...", ".rbbbbbbbbrr.", "rbbbbbbbbbbbr", "rbbbbbbbbbbbr", ".lllllllllll."],
        { r: PAL.volt[2], b: PAL.volt[0], l: PAL.volt[3] },
        1,
        5,
      ),
    );
    bolt(s, [
      [8, 11],
      [5, 13.5],
      [9, 13.5],
      [6, 16],
    ]);
    evolvedStar(s);
  },
  /** three flame columns on the floor, the middle one tallest */
  e_pyre: (s) => {
    floor(s, 0, 16, 15, RITE_RAMP[2]);
    column(s, 3, 8, 2);
    column(s, 13, 8, 2);
    column(s, 8, 13, 3);
    evolvedStar(s);
  },
};
