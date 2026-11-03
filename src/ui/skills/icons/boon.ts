import { PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { hex } from "../../../utils/color";
import { drop, fill, gem, ring, sparkle, sword } from "./parts";

const BLOOD = hex("#e0405a");
const BLOOD_LIGHT = hex("#ffb0bc");

/** Boon icons: the small rewards that fill the cards when too few skills are left */
export const BOON_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  boon_wind: (s) => {
    ring(s, 8, 9, 6.5, PAL.heal[2]);
    drop(s, 6, 10, 2.6, BLOOD, BLOOD_LIGHT);
    drop(s, 11, 10, 2.6, PAL.crystal[2], PAL.crystal[4]);
    sparkle(s, 12, 3, 2, PAL.heal[4]);
  },
  boon_vigor: (s) => {
    fill(s, () => {
      s.dot(5.5, 6.5, 3, BLOOD);
      s.dot(10.5, 6.5, 3, BLOOD);
      s.poly(
        [
          [2.6, 7.6],
          [13.4, 7.6],
          [8, 13.5],
        ],
        BLOOD,
      );
      s.set(4, 5, BLOOD_LIGHT);
      s.set(5, 4, BLOOD_LIGHT);
    });
    sparkle(s, 13, 2, 2, PAL.heal[4]);
  },
  boon_hone: (s) => {
    sword(s, 3, 13, 13, 3);
    gem(s, 4, 5, 3, 5);
    sparkle(s, 12, 10, 2.5, PAL.heal[4]);
  },
};
