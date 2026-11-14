import type { SpriteCanvas } from "../../../../engine/sprite";
import { sword } from "../../../../ui/skills/icons/parts";
import { DAWN_RAMP } from "../../constants/light";
import { beam, dome, kite } from "./parts";

/** the icons of his own damage sources on the end of run screen */
export const ALDRIC_SOURCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the sword crossed over the shield */
  aldric_attacks: (s) => {
    kite(s, 6, 9, 11);
    sword(s, 4, 13, 14, 2);
  },
  /** a pillar of light on the floor */
  aldric_abilities: (s) => beam(s, 8, 14, 2),
  /** the dome over the planted shield */
  aldric_ultimate: (s) => {
    dome(s, 8, 14, 7);
    kite(s, 8, 11, 6);
    s.begin();
    s.set(8, 2, DAWN_RAMP[6]);
    s.commit(false);
  },
};
