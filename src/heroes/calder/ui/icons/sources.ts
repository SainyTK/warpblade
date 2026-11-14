import type { SpriteCanvas } from "../../../../engine/sprite";
import { blast, gunSword, ICON, round, tracer } from "./parts";

/** Calder's own damage sources on the end of run screen */
export const CALDER_SOURCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** his attacks: the chamber sword with a blast at its point */
  calder_attacks: (s) => {
    gunSword(s, 3, 13, 12, 4);
    blast(s, 12, 4, 3);
  },
  /** his abilities: a slug flying ahead on its tracer */
  calder_abilities: (s) => {
    tracer(s, 1, 9, 12, 9);
    round(s, 13, 10, ICON.green);
  },
  /** his special: a ring of six rounds round a blast */
  calder_ultimate: (s) => {
    blast(s, 8, 8, 4, ICON.hot);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
      round(s, 8 + Math.cos(a) * 6, 9 + Math.sin(a) * 6);
    }
  },
};
