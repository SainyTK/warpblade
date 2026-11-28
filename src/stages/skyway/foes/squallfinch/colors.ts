import { hex, ramp } from "../../../../utils/color";
import { SKY_FOES } from "../colors";

export const FINCH = {
  back: ramp(["#1c2440", "#2e3c66", "#4a6296", "#7a96c6", "#b4c8ea"]),
  belly: ramp(["#8a8ea8", "#c4c8da", "#eef0f8"]),
  beak: SKY_FOES.beak,
  crest: SKY_FOES.volt,
  eye: hex("#0c0a14"),
} as const;
