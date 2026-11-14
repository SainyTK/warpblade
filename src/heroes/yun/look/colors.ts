import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import type { Ramp } from "../../../types/color";
import { hex, ramp } from "../../../utils/color";

/**
 * Yun's colours by material, each deep to glint: pale layered robes with jade trim and a jade sash, slate trousers,
 * soft dark shoes, black hair with a green sheen and a jian of pale steel. He wears no plate, so the steel materials
 * dress the sword's guard and pin only.
 */
export const YUN_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  hairGlint: hex("#bfeee0"),
  hairLight: hex("#4e6470"),
  hair: hex("#2a3442"),
  hairDark: hex("#19202c"),
  hairDeep: hex("#0e121c"),
  iris: hex("#2f9f78"),
  pupil: hex("#0f2a24"),
  coatLight: hex("#f4f2e6"),
  coat: hex("#d9d8c6"),
  coatDark: hex("#bab9a6"),
  coatDeep: hex("#7c8274"),
  steelGlint: hex("#f4fffa"),
  steelLight: hex("#c4dcd4"),
  steel: hex("#86a49c"),
  steelDark: hex("#4c665e"),
  steelDeep: hex("#2a3c38"),
  trimLight: hex("#a8f4d0"),
  trim: hex("#3fbc8c"),
  trimDark: hex("#1e6c56"),
  pantsLight: hex("#55666a"),
  pants: hex("#36444a"),
  pantsDark: hex("#222c32"),
  bootLight: hex("#4a4a52"),
  boot: hex("#2e2e36"),
  bootDark: hex("#1a1a20"),
  gloveLight: hex("#e8d8bc"),
  glove: hex("#c4ae8e"),
  scarfLight: hex("#7ee6b8"),
  scarf: hex("#2c9c74"),
  scarfDark: hex("#165c46"),
  bladeEdge: hex("#f2fff9"),
  blade: hex("#c6e6dc"),
  bladeBack: hex("#7eaea0"),
  bladeDeep: hex("#3f6c62"),
  hilt: hex("#2c2024"),
};

/** jade, deep pine to white: slashes, rings, afterimages, the warp line and every effect of Yun's */
export const JADE: Ramp = ramp(["#0c2a24", "#145444", "#1f8a66", "#3fc493", "#8ef0c6", "#dcfff0", "#ffffff"]);
/** the sparks thrown where his blows land, white to dark */
export const JADE_SPARKS: Ramp = ramp(["#ffffff", "#dcfff0", "#5fd6a4", "#1f8a66"]);
