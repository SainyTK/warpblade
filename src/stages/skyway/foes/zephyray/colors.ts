import { hex } from "../../../../utils/color";
import { SKY_FOES } from "../colors";

export const RAY = {
  back: SKY_FOES.roc,
  belly: SKY_FOES.rocBelly,
  edge: SKY_FOES.plume,
  gill: SKY_FOES.volt,
  eye: hex("#ffe27a"),
  blade: SKY_FOES.plume,
  bladeEdge: SKY_FOES.volt,
} as const;
