import { hex, ramp } from "../../../../utils/color";
import { SKY_FOES } from "../colors";

export const RAM = {
  wool: ramp(["#4c5a7c", "#8494b8", "#c4d0e6", "#f2f6fc"]),
  stormWool: ramp(["#262c48", "#3e4a70", "#64749e", "#a2b2d2"]),
  hide: ramp(["#14182a", "#262c44", "#3c4462", "#5c6688"]),
  horn: SKY_FOES.bronze,
  hoof: SKY_FOES.copper,
  eye: hex("#9ad8ff"),
  eyeHot: hex("#ffffff"),
  volt: SKY_FOES.volt,
} as const;
