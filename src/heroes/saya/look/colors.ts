import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import { hex } from "../../../utils/color";

/**
 * Saya's colours by material, each deep to glint: blue-black hair, a moon-white robe (the coat) with indigo shade,
 * dark indigo trousers, indigo wraps on her forearms and hands (the gloves), an indigo cord sash with a light indigo
 * accent (the scarf, whose light shade is also the warp crystal in her guard), a steel katana with a white edge, a
 * black lacquer scabbard (the boots' deep shades), and silver fittings (the trim).
 */
export const SAYA_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  hairGlint: hex("#c9d4ff"),
  hairLight: hex("#4b5486"),
  hair: hex("#262a46"),
  hairDark: hex("#16182c"),
  hairDeep: hex("#0b0c18"),
  iris: hex("#5c6cd0"),
  pupil: hex("#121636"),
  coatLight: hex("#ffffff"),
  coat: hex("#dde2f4"),
  coatDark: hex("#a2a9cc"),
  coatDeep: hex("#5f6694"),
  steelGlint: hex("#ffffff"),
  steelLight: hex("#e2e8f6"),
  steel: hex("#aab3cc"),
  steelDark: hex("#5e6684"),
  steelDeep: hex("#30354c"),
  trimLight: hex("#f4f6ff"),
  trim: hex("#b4bcd4"),
  trimDark: hex("#626a88"),
  pantsLight: hex("#3d469a"),
  pants: hex("#272d6c"),
  pantsDark: hex("#171b46"),
  bootLight: hex("#3e3a5c"),
  boot: hex("#1e1c30"),
  bootDark: hex("#0f0e1a"),
  gloveLight: hex("#454c8e"),
  glove: hex("#2a2f62"),
  scarfLight: hex("#8fa2ff"),
  scarf: hex("#3a4396"),
  scarfDark: hex("#1c2158"),
  bladeEdge: hex("#ffffff"),
  blade: hex("#d4dbec"),
  bladeBack: hex("#8a93b4"),
  bladeDeep: hex("#4c5374"),
  hilt: hex("#14152a"),
};
