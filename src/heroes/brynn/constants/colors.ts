import { hex, ramp, WHITE } from "../../../utils/color";

/** Brynn's crimson, dark to bright: her slashes, rings, waves, afterimages, the warp line and the blade's light */
export const CRIMSON = ramp(["#2a0710", "#5c0e1c", "#9c1a2a", "#dc3442", "#ff6a62", "#ffc2ae", "#ffffff"]);
/** the sparks thrown where her blows land, white to dark */
export const CRIMSON_SPARKS = [WHITE, hex("#ffd2bc"), hex("#ff5a52"), hex("#9c1a2a")];
/** her colour in the menus, the HF bar and the touch buttons */
export const BRYNN_ACCENT = "#ff4f5e";
