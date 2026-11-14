import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import { hex } from "../../../utils/color";

/**
 * Cerise's colours by material, each deep to glint: cherry hair, green eyes, a white fencing coat (`coat`) lined in rose
 * (`scarf`), silver buttons, cuffs and rapier fittings (`steel`, `trim`), plum breeches, black boots, white gloves and a
 * bright needle blade.
 */
export const CERISE_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  hairGlint: hex("#ffd8e6"),
  hairLight: hex("#f0627f"),
  hair: hex("#c42f4f"),
  hairDark: hex("#8a1b39"),
  hairDeep: hex("#540f27"),
  eyeWhite: hex("#f4f6fc"),
  iris: hex("#2f9c6c"),
  pupil: hex("#0f2c20"),
  coatLight: hex("#ffffff"),
  coat: hex("#eceef6"),
  coatDark: hex("#c2c4d6"),
  coatDeep: hex("#8686a4"),
  steelGlint: hex("#ffffff"),
  steelLight: hex("#e8ecf6"),
  steel: hex("#b6bdd0"),
  steelDark: hex("#737b95"),
  steelDeep: hex("#3e4459"),
  trimLight: hex("#f6f8ff"),
  trim: hex("#c4cadc"),
  trimDark: hex("#7c849c"),
  pantsLight: hex("#734064"),
  pants: hex("#4e2646"),
  pantsDark: hex("#2f152a"),
  bootLight: hex("#584656"),
  boot: hex("#2e2330"),
  bootDark: hex("#150f16"),
  gloveLight: hex("#ffffff"),
  glove: hex("#e2e0ee"),
  scarfLight: hex("#ff9cba"),
  scarf: hex("#e04f7c"),
  scarfDark: hex("#972a53"),
  bladeEdge: hex("#ffffff"),
  blade: hex("#e4eaf6"),
  bladeBack: hex("#a3aec8"),
  bladeDeep: hex("#68718e"),
  hilt: hex("#3c1f33"),
};
