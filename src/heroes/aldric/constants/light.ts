import { hex, ramp, WHITE } from "../../../utils/color";

/** Aldric's light, dark to bright: slashes, rings, afterimages and the warp line, from umber through gold to white */
export const DAWN_RAMP = ramp(["#2e2414", "#6e5420", "#b88a2e", "#e8c25a", "#fbe3a0", "#fff6dc", "#ffffff"]);
/** sparks where his blows land, white to dark */
export const DAWN_SPARKS = [WHITE, hex("#fff6dc"), hex("#f6d47a"), hex("#c8962e")];
/** the CSS colour of Valor on the HUD and of his menus */
export const DAWN_CSS = "#ffe08a";
