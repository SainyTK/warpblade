import { hex, ramp } from "../../../../utils/color";
import { FORGE } from "../../colors";

export const DRAKE = {
  hide: ramp(["#0a070b", "#161017", "#271b24", "#3f2b33", "#62423f"]),
  membrane: ramp(["#100608", "#1e0c0e", "#341514", "#55221a"]),
  horn: ramp(["#2a1c16", "#5a4032", "#8e6c56", "#c4a284"]),
  ember: FORGE.molten,
  tooth: hex("#f2e2c4"),
  eye: FORGE.eye,
  eyeHot: FORGE.eyeHot,
  outline: FORGE.outline,
} as const;
