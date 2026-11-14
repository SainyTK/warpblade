import type { SpriteCanvas } from "../../../../engine/sprite";
import { crescent, evolvedStar, fill, ring, sparkle } from "../../../../ui/skills/icons/parts";
import { WHITE } from "../../../../utils/color";
import { grains, ICON, sandRing, wound } from "./parts";
import { ZAFIR_SKILL_BASE_ICONS as BASE } from "./skills";

/** an evolved icon: the skill's own drawing, a mark of what the evolution adds, and the gold star */
const evolved =
  (id: string, mark: (s: SpriteCanvas) => void) =>
  (s: SpriteCanvas): void => {
    BASE[id](s);
    mark(s);
    evolvedStar(s);
  };

/** the evolved forms of Zafir's skills, each its skill's icon with what the evolution adds */
export const ZAFIR_EVOLVED_ICONS: Record<string, (s: SpriteCanvas) => void> = {
  za_whirling_evo: evolved("za_whirling", (s) => crescent(s, 8, 9, 7.5, 2.8, 6.9, ICON.sand[0])),
  za_sirocco_evo: evolved("za_sirocco", (s) => ring(s, 6, 9, 3, ICON.sand[0])),
  za_veins_evo: evolved("za_veins", (s) => crescent(s, 8, 9, 6.5, 2.8, 6.9, ICON.wound[1])),
  za_twofaced_evo: evolved("za_twofaced", (s) => sparkle(s, 8, 4, 1.5, WHITE)),
  za_falling_evo: evolved("za_falling", (s) =>
    grains(
      s,
      [
        [1, 10],
        [15, 10],
        [2, 7],
        [14, 7],
      ],
      ICON.sand[0],
    ),
  ),
  za_dune_evo: evolved("za_dune", (s) => wound(s, 4, 10)),
  za_arrival_evo: evolved("za_arrival", (s) => sparkle(s, 13, 3, 1.5, ICON.saffron)),
  za_slip_evo: evolved("za_slip", (s) => sandRing(s, 3, 9, 2.5, 8, ICON.sand[0])),
  za_gale_evo: evolved("za_gale", (s) => wound(s, 4, 3)),
  za_glass_evo: evolved("za_glass", (s) => sparkle(s, 8, 12, 2, ICON.glass)),
  za_quicksand_evo: evolved("za_quicksand", (s) => sandRing(s, 8, 4, 2.5, 8, ICON.sand[0])),
  za_deep_evo: evolved("za_deep", (s) => ring(s, 8, 5, 4, ICON.wound[1])),
  za_scour_evo: evolved("za_scour", (s) => sparkle(s, 3, 13, 1.5, ICON.glass)),
  za_thirst_evo: evolved("za_thirst", (s) => fill(s, () => s.stroke(2, 3, 6, 5, 0.5, ICON.sand[3]))),
  za_wraith_evo: evolved("za_wraith", (s) => sandRing(s, 8, 13, 7, 14, ICON.saffron)),
  za_mirage_evo: evolved("za_mirage", (s) => sparkle(s, 11, 6, 2, ICON.sand[0])),
  za_hawk_evo: evolved("za_hawk", (s) => sparkle(s, 3, 12, 1.5, ICON.sand[0])),
  za_unbroken_evo: evolved("za_unbroken", (s) => ring(s, 8, 8, 7.5, ICON.sand[0])),
  za_veil_evo: evolved("za_veil", (s) =>
    grains(s, [
      [13, 3],
      [14, 7],
      [12, 10],
      [14, 12],
    ]),
  ),
  za_storm_evo: evolved("za_storm", (s) => sandRing(s, 8, 9, 7.5, 18, ICON.saffron)),
};
