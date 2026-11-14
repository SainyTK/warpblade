import { onFrame } from "../../../../constants/combo";
import type { MoveDef } from "../../../../types/move";
import { AIR_CANCEL, STRING_FEEL, STRING_POWER } from "../../constants/string";
import { DRIFT, PETAL } from "./slashes";

/** Yun's air string: two light cuts that hang in the air, each echoed by his swords */
export const AIR_MOVES = {
  driftingCut: {
    id: "driftingCut",
    name: "Drifting Cut",
    clip: "drift",
    pitch: 1.2,
    cancel: AIR_CANCEL,
    hits: [
      {
        at: onFrame(5),
        box: [-4, -38, 32, 0],
        power: STRING_POWER.driftingCut,
        kx: 20,
        ky: -60,
        slash: DRIFT,
        feel: STRING_FEEL.air,
      },
    ],
  },
  fallingPetal: {
    id: "fallingPetal",
    name: "Falling Petal",
    clip: "petal",
    pitch: 1.05,
    cancel: AIR_CANCEL,
    falls: true,
    hits: [
      {
        at: onFrame(5),
        box: [-2, -36, 32, 6],
        power: STRING_POWER.fallingPetal,
        kx: 40,
        ky: 60,
        slash: PETAL,
        feel: STRING_FEEL.air,
      },
    ],
  },
} satisfies Record<string, MoveDef>;
