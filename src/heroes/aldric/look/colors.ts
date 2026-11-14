import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import { hex } from "../../../utils/color";

/**
 * Aldric's colours by material, deep to glint: fair hair, a white tabard (the coat), silver-blue plate, gold trim,
 * navy hose, steel greaves, a deep blue half cape (the scarf's colours) and a bright steel blade.
 */
export const ALDRIC_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  hairGlint: hex("#fffbea"),
  hairLight: hex("#ffeab0"),
  hair: hex("#e6c063"),
  hairDark: hex("#b5863a"),
  hairDeep: hex("#74512a"),
  iris: hex("#3d7ad6"),
  coatLight: hex("#ffffff"),
  coat: hex("#e8e4d8"),
  coatDark: hex("#b3ac9c"),
  coatDeep: hex("#6c6656"),
  steelGlint: hex("#f6f9ff"),
  steelLight: hex("#c6d4ee"),
  steel: hex("#8c9ec6"),
  steelDark: hex("#4f6089"),
  steelDeep: hex("#2a3456"),
  pantsLight: hex("#46507a"),
  pants: hex("#2f3858"),
  pantsDark: hex("#1d2340"),
  bootLight: hex("#b2c0de"),
  boot: hex("#6c7ca6"),
  bootDark: hex("#343e62"),
  gloveLight: hex("#7a5a40"),
  glove: hex("#4e3828"),
  scarfLight: hex("#5f80d6"),
  scarf: hex("#35519e"),
  scarfDark: hex("#1e2d63"),
  bladeEdge: hex("#ffffff"),
  blade: hex("#e2eaf8"),
  bladeBack: hex("#9cabca"),
  bladeDeep: hex("#5b678a"),
  hilt: hex("#3e2a1e"),
};
