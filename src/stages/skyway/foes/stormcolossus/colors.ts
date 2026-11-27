import { hex, ramp } from "../../../../utils/color";
import { SKY_FOES } from "../colors";

export const COLOSSUS = {
  bronze: SKY_FOES.bronze,
  patina: SKY_FOES.verdigris,
  iron: SKY_FOES.steel,
  core: SKY_FOES.volt,
  vapour: ramp(["#5a6a8c", "#94a8c8", "#d4e0f2", "#ffffff"]),
  slit: hex("#9ad8ff"),
  cable: ramp(["#1a1410", "#3a2c20", "#5e4630"]),
} as const;
