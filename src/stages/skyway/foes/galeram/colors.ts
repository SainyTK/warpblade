import { hex, ramp } from "../../../../utils/color";
import { SKY_FOES } from "../colors";

export const RAM = {
  wool: ramp(["#3a2016", "#7a4a2e", "#b8804e", "#e6b878", "#fff0c8"]),
  stormWool: ramp(["#24182a", "#4c3446", "#7c5a62", "#b08a80", "#e2c8b0"]),
  hide: ramp(["#120e16", "#271e2a", "#3e3242", "#5c4c5c", "#806e7a"]),
  horn: SKY_FOES.bronze,
  hoof: SKY_FOES.copper,
  eye: hex("#9ad8ff"),
  eyeHot: hex("#ffffff"),
  volt: SKY_FOES.volt,
} as const;
