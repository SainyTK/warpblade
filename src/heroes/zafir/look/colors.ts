import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import { hex } from "../../../utils/color";

/**
 * Zafir's colours by material, each deep to glint: saffron wraps and head wrap, cream trousers and under-layers, a
 * turquoise sash, gold bangles and trim, warm brown skin, dark curls and a pale steel scimitar.
 */
export const ZAFIR_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  skinLight: hex("#e2a878"),
  skin: hex("#c0814f"),
  skinShade: hex("#925a36"),
  skinDeep: hex("#623822"),
  hairGlint: hex("#9a7866"),
  hairLight: hex("#5a4238"),
  hair: hex("#3a2a2a"),
  hairDark: hex("#24181c"),
  hairDeep: hex("#140c10"),
  eyeWhite: hex("#f4ecdc"),
  iris: hex("#d8962a"),
  pupil: hex("#2a140a"),
  coatLight: hex("#f6b45a"),
  coat: hex("#e0832e"),
  coatDark: hex("#a8521c"),
  coatDeep: hex("#622a10"),
  steelGlint: hex("#fffdf4"),
  steelLight: hex("#e2dccb"),
  steel: hex("#b0a690"),
  steelDark: hex("#6e6656"),
  steelDeep: hex("#3a352c"),
  pantsLight: hex("#f6e8c8"),
  pants: hex("#dcc396"),
  pantsDark: hex("#a88e62"),
  bootLight: hex("#b0825a"),
  boot: hex("#7e5636"),
  bootDark: hex("#4a3020"),
  gloveLight: hex("#f6e8c8"),
  glove: hex("#c9ad7c"),
  scarfLight: hex("#62d8ca"),
  scarf: hex("#22a49a"),
  scarfDark: hex("#11625e"),
  bladeEdge: hex("#fffbea"),
  blade: hex("#e6dcc6"),
  bladeBack: hex("#a89a80"),
  bladeDeep: hex("#6a5e4a"),
  hilt: hex("#4a2a1a"),
};
