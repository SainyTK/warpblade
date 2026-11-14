import type { SpriteCanvas } from "../../../../engine/sprite";
import { JADE } from "../../look";
import { jian, qi, spirit, swirl } from "./parts";

/** the icons of Yun's own damage sources on the end of run screen */
export const YUN_SOURCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the jian in a round cut, a spirit sword thrusting past it */
  yun_attacks: (s) => {
    swirl(s, 8, 8, 6, -2.6, 0.8, JADE[3]);
    jian(s, 3, 13, 13, 3);
    spirit(s, 3, 9, 15, 9);
  },
  /** three spirit swords flying out in a stream */
  yun_abilities: (s) => {
    spirit(s, 1, 4, 13, 4);
    spirit(s, 3, 8, 15, 8);
    spirit(s, 1, 12, 13, 12);
  },
  /** spirit swords falling point first onto a qi burst */
  yun_ultimate: (s) => {
    spirit(s, 3, 1, 5, 11);
    spirit(s, 8, 0, 8, 12);
    spirit(s, 13, 1, 11, 11);
    qi(s, 6, 13, 2, JADE[5]);
  },
};
