import { onFrame } from "../../../../constants/combo";
import type { MoveDef } from "../../../../types/move";
import { STRING_CANCEL, STRING_FEEL, STRING_POWER } from "../../constants/string";
import { sheatheFlash } from "../effects/sheatheFlash";
import { beginDraw } from "../focus";
import { sayaSound } from "../sound";
import { releaseCuts } from "../store";
import { SLASHES } from "./slashes";

/** the falling draw: one per airtime, drawn as she drops; it drives a foe in the air down, and on landing the blade
 *  clicks home and releases every stored cut in full */
export const AIR_MOVES = {
  airDraw: {
    id: "airDraw",
    name: "Falling draw",
    clip: "airDraw",
    falls: true,
    untilLanding: true,
    pitch: 0.95,
    cancel: STRING_CANCEL.airDraw,
    enter: () => {
      beginDraw();
      sayaSound.draw();
    },
    hits: [
      {
        at: onFrame(4),
        box: [-4, -34, 34, 6],
        power: STRING_POWER.airDraw.now,
        kx: 20,
        ky: 0,
        spike: true,
        slash: SLASHES.fall,
        feel: STRING_FEEL.airDraw,
      },
    ],
    land: () => {
      sayaSound.click();
      sheatheFlash();
      releaseCuts(true);
    },
  },
} satisfies Record<string, MoveDef>;
