import { FIRE_RAMP, PAL } from "../../../../constants/palette";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { WHITE } from "../../../../utils/color";
import { TAU } from "../../../../utils/math";
import { fill, flame } from "../parts";

/** a broken ring of embers lying on the floor, its near half brighter */
function emberRing(s: SpriteCanvas, rx: number, ry: number, far: number, near: number): void {
  fill(s, () => {
    for (let i = 0; i < 14; i++) {
      const a = (i * TAU) / 14;
      if (i % 3 === 2) continue;
      s.dot(8 + Math.cos(a) * rx, 12 + Math.sin(a) * ry, 0.6, Math.sin(a) > 0 ? near : far);
    }
  });
}

/** Ember Aura's icon and Sun Heart's */
export const AURA_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** a ring of embers on the floor with a flame rising out of it and sparks drifting up */
  relic_aura: (s) => {
    emberRing(s, 6.5, 2.5, FIRE_RAMP[6], FIRE_RAMP[4]);
    flame(s, 8, 12, 8);
    fill(s, () => {
      s.set(3, 6, FIRE_RAMP[2]);
      s.set(13, 4, FIRE_RAMP[3]);
      s.set(12, 8, FIRE_RAMP[1]);
    });
  },
  /** a sun burning over a golden ring, a green spark of healing beside it */
  relic_aura_evo: (s) => {
    emberRing(s, 7, 2.5, FIRE_RAMP[4], FIRE_RAMP[2]);
    fill(s, () => {
      for (let i = 0; i < 8; i++) {
        const a = (i * TAU) / 8;
        s.stroke(
          8 + Math.cos(a) * 3.5,
          6.5 + Math.sin(a) * 3.5,
          8 + Math.cos(a) * 5.5,
          6.5 + Math.sin(a) * 5.5,
          0.45,
          FIRE_RAMP[3],
        );
      }
    });
    fill(s, () => {
      s.dot(8, 6.5, 3, FIRE_RAMP[2]);
      s.dot(7.5, 6, 1.6, FIRE_RAMP[1]);
      s.set(7, 5, WHITE);
    });
    fill(s, () => {
      s.stroke(13, 9.5, 13, 14.5, 0.6, PAL.heal[2]);
      s.stroke(10.5, 12, 15.5, 12, 0.6, PAL.heal[2]);
      s.set(13, 12, PAL.heal[4]);
    });
  },
};
