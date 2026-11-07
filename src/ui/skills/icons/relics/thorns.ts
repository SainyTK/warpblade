import { THORN_COLORS } from "../../../../constants/relics/thorns";
import type { SpriteCanvas } from "../../../../engine/sprite";
import type { Ramp } from "../../../../types/color";
import { fill } from "../parts";

/** spikes standing on a strip of floor: [x, height, lean] each */
function spikes(s: SpriteCanvas, ramp: Ramp, list: readonly (readonly [number, number, number])[]): void {
  fill(s, () => {
    for (const [x, h, lean] of list)
      s.poly(
        [
          [x - 1.6, 14.5],
          [x + 1.6, 14.5],
          [x + lean, 14.5 - h],
        ],
        ramp[2],
      );
  });
  fill(s, () => {
    for (const [x, h, lean] of list) {
      s.stroke(x + 0.5, 13.5, x + lean, 15 - h, 0.35, ramp[3]);
      s.set(x + lean, 14.5 - h, ramp[4]);
    }
  });
  fill(s, () => s.stroke(1, 15, 15, 15, 0.5, ramp[1]));
}

/** Thorn Trail's icon and Bramble Wake's */
export const THORNS_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a few thorns rising behind a stride, the newest the tallest */
  relic_thorns: (s) => {
    spikes(s, THORN_COLORS.trail, [
      [3, 4, -0.5],
      [7.5, 7, 0.5],
      [12, 10, 0.5],
    ]);
  },
  /** a thick hedge of briar thorns with lit points */
  relic_thorns_evo: (s) => {
    spikes(s, THORN_COLORS.bramble, [
      [2.5, 7, -1],
      [5.5, 11, 0],
      [8.5, 8, 0.5],
      [11, 12, 0],
      [13.5, 7, 1],
    ]);
    fill(s, () => {
      s.set(5.5, 3, THORN_COLORS.bramble[4]);
      s.set(11, 2, THORN_COLORS.bramble[4]);
    });
  },
};
