import { EMBER } from "../../../../constants/characters/ysra/look";
import type { SpriteCanvas } from "../../../../engine/sprite";
import { chevron, fill } from "../parts";
import { brace, ember, floor, glaive, vaultArc } from "./parts";

/** Ysra's fusion icons: each mixes the marks of the two paths it joins */
export const YSRA_FUSION_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  /** Molten Guard: the brace, and the Heat it gathers rising off it */
  x_molten: (s) => {
    brace(s, 0, 9, 7);
    ember(s, 12, 15, 10);
    chevron(s, 3, 6, 0, -1, 2, EMBER[5]);
    chevron(s, 3, 10, 0, -1, 2, EMBER[4]);
  },
  /** Hot Iron: a lunge that ends in a pillar of fire at its tip */
  x_hotIron: (s) => {
    floor(s, 1, 15, 15, EMBER[2]);
    fill(s, () =>
      s.poly(
        [
          [10, 15],
          [15, 15],
          [14.5, 5],
          [12.5, 1],
          [10.5, 5],
        ],
        EMBER[3],
      ),
    );
    fill(s, () => s.stroke(12.5, 14, 12.5, 5, 0.6, EMBER[5]));
    glaive(s, 0, 11, 13, 11);
  },
  /** Skyline: two vaults chained in the air, climbing */
  x_skyline: (s) => {
    floor(s, 0, 6, 15);
    vaultArc(s, 1, 9, 14, 8, EMBER[3]);
    vaultArc(s, 8, 15, 7, 6, EMBER[5]);
    chevron(s, 14, 1, 0.4, -1, 2, EMBER[5]);
  },
};
