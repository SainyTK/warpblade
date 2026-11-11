import { hex, ramp } from "../../../utils/color";

/** The fine detail colors of the moonlit ruins: the sky, the moon, moonlight and firelight on stone, and the grass. */

/** the moon's surface, night side to the brightest highland */
export const MOON_TONES = ramp(["#4f4a80", "#7c75a8", "#a9a2cc", "#cfc8e8", "#ece6fa", "#fdfaff"]);
/** the soft light around the moon, and the thin cloud lit by it and seen against it */
export const MOON_HALO = hex("#7f78d0");
export const CLOUD_LIT = hex("#8a80c8");
export const CLOUD_ON_MOON = hex("#6a6298");
/** the milky band's glow */
export const STAR_BAND = hex("#6a62b4");
/** star colors: most are cool white, a few blue or warm */
export const STAR_TINTS = ramp(["#e8e4ff", "#bcd0ff", "#ffe6c8", "#d8c8ff"]);
export const STAR_FAINT = hex("#6e66a8");

/** moonlight on stone: the wash near a lit edge and the edge itself */
export const MOON_STONE = hex("#5f58a4");
export const MOON_EDGE = hex("#a8a8f0");
/** the blue light along the floor's lip */
export const FLOOR_LIP_LIGHT = hex("#aab8ff");
export const FLOOR_WASH = hex("#5a6cc8");
/** firelight on stone, around a lit window and a brazier */
export const FIRE_STONE = hex("#d07a3a");
export const FIRE_EDGE = hex("#ffb868");
/** a lit window: the pane from its top down, its frame and its sill */
export const WINDOW_PANE = ramp(["#fff0b8", "#ffcf6a", "#e09a40", "#b06a2c"]);
export const WINDOW_FRAME = hex("#0c0818");
/** a dark opening in a tower */
export const OPENING = hex("#0a0716");

/** grass and vines, shade to the moonlit tip */
export const GRASS = ramp(["#24403a", "#34604a", "#4f8a5c", "#9ad8b4"]);
export const VINE_LIGHT = hex("#86c89a");

/** a shooting star, head to tail */
export const METEOR = ramp(["#ffffff", "#cfd8ff", "#7f86d8"]);
