import { hex, ramp } from "../../../../utils/color";
import { SKY_FOES } from "../colors";

export const WYRM = {
  scale: SKY_FOES.roc,
  dull: ramp(["#14161e", "#24283a", "#3a4058", "#565e7a", "#7a849e"]),
  belly: SKY_FOES.rocBelly,
  fin: SKY_FOES.plume,
  horn: SKY_FOES.beak,
  volt: SKY_FOES.volt,
  eye: hex("#fff2a0"),
} as const;
