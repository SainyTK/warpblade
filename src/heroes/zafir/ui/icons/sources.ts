import type { SpriteCanvas } from "../../../../engine/sprite";
import { crescent } from "../../../../ui/skills/icons/parts";
import { funnel, grains, ICON, sandRing, scimitar } from "./parts";

/** his own damage sources on the end of run screen: the spins, the abilities, the storm */
export const ZAFIR_SOURCE_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** the scimitar inside a ring of cut */
  zafir_attacks: (s) => {
    crescent(s, 8, 9, 6, 2.6, 7.2, ICON.saffron);
    scimitar(s, 4, 12, 13, 4);
  },
  /** a whirl of sand rising from the floor */
  zafir_abilities: (s) => {
    funnel(s, 8, 2, 14, 6, 1.5);
    sandRing(s, 8, 14.5, 4, 10, ICON.sand[2]);
  },
  /** a storm round a figure's scimitar held high */
  zafir_ultimate: (s) => {
    funnel(s, 8, 1, 15, 7, 2.5);
    scimitar(s, 8, 12, 8, 3);
    grains(
      s,
      [
        [1, 6],
        [15, 4],
        [1, 12],
        [15, 11],
      ],
      ICON.saffron,
    );
  },
};
