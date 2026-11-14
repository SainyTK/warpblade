import { BASE_HERO_COLORS, type HeroColors } from "../../../constants/palette";
import { hex, ramp, WHITE } from "../../../utils/color";

/**
 * Vesper's colours by material, each deep to glint: pale silver hair with a lilac cast, a plum coat, ash wraps and sash,
 * a violet scarf, a pale long blade and silver fittings. The short blade is drawn in the steel colours with a violet edge.
 */
export const VESPER_COLORS: HeroColors = {
  ...BASE_HERO_COLORS,
  hairLight: hex("#efeaf8"),
  hair: hex("#c9c1dc"),
  hairDark: hex("#8d84ac"),
  hairDeep: hex("#574e7a"),
  iris: hex("#9a6ae0"),
  pupil: hex("#24143e"),
  coatLight: hex("#62508e"),
  coat: hex("#40326a"),
  coatDark: hex("#2a2048"),
  coatDeep: hex("#18122e"),
  steelGlint: hex("#e8e2ff"),
  steelLight: hex("#8a82aa"),
  steel: hex("#4e4870"),
  steelDark: hex("#2e2a48"),
  steelDeep: hex("#1a1730"),
  trimLight: hex("#f4f2ff"),
  trim: hex("#bdb8d6"),
  trimDark: hex("#6f6a94"),
  pantsLight: hex("#4a4458"),
  pants: hex("#2f2a3c"),
  pantsDark: hex("#1d1a28"),
  bootLight: hex("#6a4e66"),
  boot: hex("#46323f"),
  bootDark: hex("#281a26"),
  gloveLight: hex("#ece4d8"),
  glove: hex("#b9ab9e"),
  scarfLight: hex("#cbb2ff"),
  scarf: hex("#8a62d8"),
  scarfDark: hex("#4c328e"),
  bladeEdge: WHITE,
  blade: hex("#e2def4"),
  bladeBack: hex("#a49ec8"),
  bladeDeep: hex("#625c8e"),
  hilt: hex("#2c1e30"),
};

/** violet dusk: her slashes, rings, afterimages and the warp line, dark to bright */
export const DUSK_RAMP = ramp(["#140c2a", "#2e1c5e", "#5236a0", "#7f5ed8", "#b8a0ff", "#e6dcff", "#ffffff"]);
/** the sparks where her blows land, white to dark */
export const DUSK_SPARKS = [WHITE, hex("#e6dcff"), hex("#b8a0ff"), hex("#5236a0")];
/** the short blade's slashes: a deeper night violet beside the long blade's dusk */
export const NIGHT_RAMP = ramp(["#0e0820", "#22144a", "#3e2680", "#6a4cc0", "#9c86f0", "#d4c8ff", "#ffffff"]);
