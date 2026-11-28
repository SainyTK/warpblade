import { hex, ramp } from "../../../../utils/color";
import { SKY_FOES } from "../colors";

export const NIMBIT = {
  puff: ramp(["#3c4868", "#6c7ea6", "#a8bcdc", "#e2ecfa"]),
  storm: ramp(["#1e2440", "#343e64", "#56648e", "#8494bc"]),
  foot: ramp(["#1a1c2c", "#363a54", "#5a6080"]),
  eye: SKY_FOES.outline,
  spark: SKY_FOES.volt,
  cheek: hex("#c88ab8"),
} as const;
