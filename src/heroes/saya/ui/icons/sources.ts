import type { SpriteCanvas } from "../../../../engine/sprite";
import { inkStroke, katana, moon, scabbard } from "./parts";

/** the icons of Saya's own damage sources on the end of run screen */
export const SAYA_SOURCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the katana drawn over an ink stroke */
  saya_attacks: (s) => {
    inkStroke(s, 2, 11, 14, 9);
    katana(s, 3, 14, 13, 3);
  },
  /** the sheathed katana over a rising stroke */
  saya_abilities: (s) => {
    inkStroke(s, 3, 14, 12, 3, 1.2);
    scabbard(s, 2, 12, 14, 8);
  },
  /** a crescent moon crossed by two lines */
  saya_ultimate: (s) => {
    moon(s, 8, 8, 6);
    inkStroke(s, 1, 4, 15, 12, 0.8);
    inkStroke(s, 1, 11, 15, 5, 0.8);
  },
};
