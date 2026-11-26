import type { Color, Ramp } from "../types/color";
import { mix, WHITE } from "../utils/color";

const DUSK = 0x111523;

export const sparkRamp = (color: Color, core: Color = mix(color, WHITE, 0.55)): Ramp => [
  WHITE,
  core,
  color,
  mix(color, DUSK, 0.4),
];
