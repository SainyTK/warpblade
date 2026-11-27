import type { Color, Ramp } from "../../../types/color";
import { mix, scale, WHITE } from "../../../utils/color";
import { AC, VOID, VOID_SPARKS } from "./colors";

export interface StrikeLook {
  ramp: Ramp;
  sparks: readonly Color[];
  outline: Color;
}

export const VOID_LOOK: StrikeLook = { ramp: VOID, sparks: VOID_SPARKS, outline: AC.outline };

export const lightLook = (light: Color): StrikeLook => ({
  ramp: [
    scale(light, 0.12),
    scale(light, 0.3),
    scale(light, 0.55),
    light,
    mix(light, WHITE, 0.5),
    mix(light, WHITE, 0.85),
  ],
  sparks: [mix(light, WHITE, 0.85), mix(light, WHITE, 0.5), light, scale(light, 0.4)],
  outline: scale(light, 0.06),
});
