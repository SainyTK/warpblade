import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import { hex } from "../../../utils/color";

/**
 * Kael's colours by material, each deep to glint: silver hair with a cold blue shadow, a midnight blue long coat,
 * crystal cyan eyes, and the base palette's steel, brass trim and red scarf.
 */
export const KAEL_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  hairLight: hex("#e4f2ff"),
  hair: hex("#b2c6de"),
  hairDark: hex("#6e82a8"),
  hairDeep: hex("#3a4672"),
  iris: hex("#2fa8e0"),
  coatLight: hex("#4672b4"),
  coat: hex("#2a4a86"),
  coatDark: hex("#1c315e"),
  coatDeep: hex("#101c3c"),
};
