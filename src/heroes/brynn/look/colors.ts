import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import { hex } from "../../../utils/color";

/**
 * Brynn's colours by material, each deep to glint: red-brown hair, a slate jacket over a dark top, sand trousers, big
 * brown boots, dark iron plate with bronze trim, a crimson headband and sash, and Anvilheart's grey steel.
 */
export const BRYNN_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  hairGlint: hex("#ffd9b0"),
  hairLight: hex("#e8794a"),
  hair: hex("#b44a2c"),
  hairDark: hex("#7c2c1e"),
  hairDeep: hex("#4a1814"),
  iris: hex("#d2622c"),
  pupil: hex("#2a0e0a"),
  coatLight: hex("#66657a"),
  coat: hex("#454457"),
  coatDark: hex("#2e2d3c"),
  coatDeep: hex("#1a1922"),
  steelGlint: hex("#fff2ea"),
  steelLight: hex("#c4b9b8"),
  steel: hex("#867b80"),
  steelDark: hex("#4e464e"),
  steelDeep: hex("#2a242c"),
  trimLight: hex("#f4c27a"),
  trim: hex("#c48a3c"),
  trimDark: hex("#7c5222"),
  pantsLight: hex("#c7b08a"),
  pants: hex("#9a8462"),
  pantsDark: hex("#685640"),
  bootLight: hex("#7c5638"),
  boot: hex("#4c3322"),
  bootDark: hex("#281a12"),
  gloveLight: hex("#6a4a36"),
  glove: hex("#3e2a20"),
  scarfLight: hex("#ff5a64"),
  scarf: hex("#c8203a"),
  scarfDark: hex("#6e0c20"),
  bladeEdge: hex("#f6f2f0"),
  blade: hex("#b9b2b8"),
  bladeBack: hex("#767079"),
  bladeDeep: hex("#403b46"),
  hilt: hex("#2c1a1a"),
};
