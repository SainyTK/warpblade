import { PAL } from "../../../constants/palette";
import type { SpriteCanvas } from "../../../engine/sprite";
import { hex } from "../../../utils/color";
import { drop, ring, sparkle } from "./parts";

const BLOOD = hex("#e0405a");
const BLOOD_LIGHT = hex("#ffb0bc");

/** Boon icons: the reward that fills the cards when too few skills are left */
export const BOON_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  boon_wind: (s) => {
    ring(s, 8, 9, 6.5, PAL.heal[2]);
    drop(s, 6, 10, 2.6, BLOOD, BLOOD_LIGHT);
    drop(s, 11, 10, 2.6, PAL.crystal[2], PAL.crystal[4]);
    sparkle(s, 12, 3, 2, PAL.heal[4]);
  },
};
