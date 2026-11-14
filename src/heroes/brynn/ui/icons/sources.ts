import type { SpriteCanvas } from "../../../../engine/sprite";
import { crest, floor, greatsword, heavyArc } from "./parts";

/** Brynn's own damage sources on the end of run screen */
export const BRYNN_SOURCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** her blows: Anvilheart raised point up */
  brynn_attacks: (s) => greatsword(s, 3, 13, 13, 3),
  /** her abilities: a wave of crimson running along the floor */
  brynn_abilities: (s) => {
    floor(s);
    crest(s, 12, 9, 7);
    crest(s, 6, 5, 4);
  },
  /** Crimson Fall: one huge crescent coming down into the floor */
  brynn_ultimate: (s) => {
    floor(s);
    heavyArc(s, 8, 10, 7, -2.9, 0.4, 1.6);
    greatsword(s, 9, 2, 13, 12, 1.2);
  },
};
