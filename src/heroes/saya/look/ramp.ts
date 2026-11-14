import { ramp } from "../../../utils/color";

/**
 * Saya's effects are ink brush strokes with a white edge: her ramp runs from ink black through indigo to moon white, so
 * a slash's rim and head are white and its body cools into ink. Seven steps, dark to bright.
 */
export const INK_RAMP = ramp(["#04050f", "#0a0c22", "#13183a", "#222a5c", "#4a56b0", "#d6ddff", "#ffffff"]);

/** her hit sparks, white to ink */
export const INK_SPARKS = ramp(["#ffffff", "#dfe5ff", "#5d68c0", "#1c2158"]);
