import { hex, ramp } from "../../../utils/color";

export const KNIGHT_COLORS = {
  outline: hex("#07061a"),
  steelDeep: hex("#100e22"),
  steelDark: hex("#1d1a38"),
  steel: hex("#2e2a54"),
  steelLight: hex("#4c4880"),
  steelRim: hex("#9aa0dc"),
  steelGlint: hex("#e4e8ff"),
  crystalDeep: hex("#0f4a5a"),
  crystalDark: hex("#1f7f96"),
  crystal: hex("#45cfe0"),
  crystalLight: hex("#9ff4f6"),
  crystalHot: hex("#effffd"),
  visor: hex("#fff2a8"),
  visorHot: hex("#ffffff"),
  cloth: hex("#3a1e58"),
  clothLight: hex("#5e3488"),
  clothDark: hex("#22103a"),
} as const;

export const SHARD_SPARKS = ramp(["#effffd", "#9ff4f6", "#45cfe0", "#1f7f96"]);

export const KNIGHT_HITS = {
  cut: 18,
  blinkCut: 20,
} as const;
