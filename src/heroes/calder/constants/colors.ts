import { hex, ramp, WHITE } from "../../../utils/color";

/** Calder's phosphor green, dark to white: his slashes, rings, afterimages, the warp line and his rounds' tracers */
export const PHOSPHOR = ramp(["#121c12", "#1f3a1c", "#2f6a24", "#56a83a", "#9ae05a", "#dcffa8", "#ffffff"]);
/** the sparks where his blows land, white to dark */
export const PHOSPHOR_SPARKS = [WHITE, hex("#eaffc4"), hex("#b4ff5a"), hex("#56a83a")];
/** a hot round's blast: brass gold over the green */
export const HOT_RAMP = ramp(["#2a1c08", "#6a4a12", "#b88a24", "#f2c440", "#ffe066", "#fff4c0", "#ffffff"]);
/** the smoke a round leaves at the muzzle */
export const GUNSMOKE = hex("#8a9488");
/** the menu accent, a CSS colour */
export const ACCENT = "#b4ff5a";
