import { hex, ramp } from "../../../utils/color";

/** violet crystal from its deep root to its white hot tip */
export const CRYSTAL = ramp(["#3a1f6a", "#6a3cb0", "#9a6ae8", "#d6b4ff", "#f6ecff"]);
/** the teal crystal that grows where the other sky's light falls */
export const CRYSTAL_TEAL = ramp(["#0f3a4a", "#1f7a8a", "#3fc8cc", "#9af4ec", "#eafffa"]);
/** the hues a rune burns in: teal, violet, rose */
export const RUNE_HUES = [hex("#5ee8f0"), hex("#c08aff"), hex("#ff8ae8")];

/** the aurora's ribbons, each from its bright top edge down to the foot of its curtain */
export const RIBBON_TONES = [
  ramp(["#c4ffe9", "#3fd8c0", "#4a52c0"]),
  ramp(["#ffc8f4", "#c452e4", "#4a2a9a"]),
  ramp(["#bfe4ff", "#5a8ae8", "#3a2a90"]),
];
/** the aurora's moving light, one hue per ribbon */
export const RIBBON_LIGHT = [hex("#4ab8c8"), hex("#a24ae0"), hex("#4a6ad8")];

/** the sky seen through a tear, from its upper end to its lower end */
export const OTHER_SKY = ramp(["#2fd6cc", "#b8fff0", "#fff2c4", "#ffb48c"]);
export const TEAR = {
  rim: hex("#fbf4ff"),
  halo: hex("#b070ff"),
  crack: hex("#d8c0ff"),
  light: hex("#9a7aff"),
  star: hex("#ffffff"),
};

export const MOON_HALO = hex("#7a4ad0");
export const RING = { lit: hex("#e4d8ff"), dim: hex("#7f6ac8"), band: hex("#a894e8") };
export const PLANET = ramp(["#1c3266", "#2a4a86", "#3e86b8", "#7fd6ef", "#c8faff"]);
export const PLANET_LIGHT = hex("#4ab0d0");

/** floating rock from its shadowed underside to its lit edge */
export const ROCK = ramp(["#1e1636", "#2e2450", "#4a3c78", "#7c6cb4", "#b0a4e4"]);
export const ISLAND_MOSS = { tip: hex("#8ffbe8"), body: hex("#2f9a9c") };

/** the veil's light where it catches stone: lilac high up, teal toward the floor */
export const STONE_LIGHT = { high: hex("#b9b0ff"), low: hex("#62d6e4"), vein: hex("#5ee8f0"), veinHot: hex("#d4fffa") };

export const FLAME_NIGHT = ramp(["#fff3a6", "#ffe26b", "#ff8a2a", "#f2561d"]);
export const FLAME_MAGIC = ramp(["#f4f0ff", "#c0b8ff", "#8a6aff", "#5a2ac0"]);
export const MOTES = ramp(["#7ff6ff", "#ff8ae8", "#ffe27a", "#b08cff", "#8affc0"]);
