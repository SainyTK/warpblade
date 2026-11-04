import { hex, ramp } from "../../../utils/color";

/** the day foes: meadow things grown wild, split by violet rift light */
export const DAY_COLORS = {
  outline: hex("#140c10"),
  hide: ramp(["#24160f", "#3e281c", "#5c3c28", "#80583a"]),
  bramble: ramp(["#1e3418", "#2f5226", "#467634", "#6c9e44"]),
  thorn: hex("#d8c89c"),
  thornTip: hex("#fff4d8"),
  tusk: hex("#f2ead0"),
  crack: hex("#b673e8"),
  crackHot: hex("#ecc8ff"),
  eye: hex("#ffd0ff"),
  mothBody: ramp(["#1e1424", "#36263e", "#584060", "#8a6a86"]),
  wing: ramp(["#4a2a3c", "#8a4a3a", "#d08a3c", "#f2c25a", "#fff0b0"]),
  wingSpot: hex("#7a3cb0"),
  bark: ramp(["#22160e", "#3c2818", "#5a3e26", "#7c5a38", "#a07c50"]),
  leaf: ramp(["#1e4a1c", "#2e6a26", "#4c9234", "#7cbc44", "#b4e070"]),
  moss: hex("#5c9a36"),
  acornCap: hex("#5a3a20"),
  acorn: hex("#c08a48"),
  acornLit: hex("#e8b870"),
  pollen: ramp(["#c87a2a", "#f2c25a", "#ffe890", "#fff8e0"]),
  pollenPink: hex("#ffb0d8"),
} as const;

/** sparks for the day foes' rift embers and bursts, bright to dim */
export const DAY_SPARKS = {
  rift: [hex("#ecc8ff"), hex("#b673e8"), hex("#7a3cb0"), hex("#4a2470")],
  pollen: [hex("#fff8e0"), hex("#ffe890"), hex("#f2c25a"), hex("#c87a2a")],
  leaf: [hex("#d8f0a0"), hex("#7cbc44"), hex("#4c9234"), hex("#2e6a26")],
  bark: [hex("#e8b870"), hex("#a07c50"), hex("#5a3e26"), hex("#3c2818")],
};
