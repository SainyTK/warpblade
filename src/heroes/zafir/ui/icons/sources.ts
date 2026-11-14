import type { SpriteCanvas } from "../../../../engine/sprite";
import { crescent } from "../../../../ui/skills/icons/parts";
import { grains, ICON, sandRing, scimitar } from "./parts";

/** his own damage sources on the end of run screen: the spins, the abilities, the storm */
export const ZAFIR_SOURCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the scimitar inside a ring of cut */
  zafir_attacks: (s) => {
    crescent(s, 8, 9, 6, 2.6, 7.2, ICON.saffron);
    scimitar(s, 4, 12, 13, 4);
  },
  /** a whirl of sand rising from the floor */
  zafir_abilities: (s) => {
    for (let i = 0; i < 5; i++) sandRing(s, 8, 14 - i * 2.6, 1.5 + i, 6 + i * 2, ICON.sand[i % 3]);
  },
  /** a storm round a figure's scimitar held high */
  zafir_ultimate: (s) => {
    sandRing(s, 8, 6, 6, 14);
    sandRing(s, 8, 11, 5, 12, ICON.sand[2]);
    scimitar(s, 8, 13, 8, 2);
    grains(s, [
      [2, 3],
      [14, 4],
      [1, 12],
      [15, 13],
    ]);
  },
};
