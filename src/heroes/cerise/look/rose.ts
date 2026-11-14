import { hex, ramp, WHITE } from "../../../utils/color";

/** Cerise's rose light, dark to bright: her thrust streaks, rings, afterimages and the warp line */
export const ROSE_RAMP = ramp(["#3a0c24", "#7a1a46", "#c23a6e", "#ff6f9c", "#ffa9c6", "#ffe1eb", "#ffffff"]);
/** the glow of her blade and her casts */
export const ROSE_GLOW = hex("#ff8fb0");
/** the sparks where her thrusts land, white to dark */
export const ROSE_SPARKS = [WHITE, hex("#ffe1eb"), hex("#ff8fb0"), hex("#c23a6e")];
