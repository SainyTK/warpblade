import { onFrame } from "../../../../constants/combo";
import type { MoveDef } from "../../../../types/move";
import { STRING_CANCEL, STRING_FEEL, STRING_POWER } from "../../constants/string";
import { sheatheFlash } from "../effects/sheatheFlash";
import { beginDraw } from "../focus";
import { sayaSound } from "../sound";
import { SLASHES } from "./slashes";

/**
 * The string: a draw cut that leaves the scabbard in one level stroke, a return cut that rises across her, and the
 * sheathe, whose click strikes a short blow ahead and releases every stored cut (`afterStrike` in the kit). Her feet
 * stay planted; the draw's long step is in the clip.
 */
export const STRING_MOVES = {
  drawCut: {
    id: "drawCut",
    name: "Draw cut",
    clip: "drawCut",
    pitch: 1.05,
    cancel: STRING_CANCEL.drawCut,
    enter: () => {
      beginDraw();
      sayaSound.draw();
    },
    hits: [
      {
        at: onFrame(5),
        box: [-2, -38, 38, -2],
        power: STRING_POWER.drawCut.now,
        kx: 8,
        ky: -10,
        big: true,
        slash: SLASHES.draw,
        feel: STRING_FEEL.drawCut,
      },
    ],
  },
  returnCut: {
    id: "returnCut",
    name: "Return cut",
    clip: "returnCut",
    pitch: 1.15,
    cancel: STRING_CANCEL.returnCut,
    hits: [
      {
        at: onFrame(5),
        box: [-6, -46, 30, -2],
        power: STRING_POWER.returnCut.now,
        kx: 8,
        ky: -30,
        slash: SLASHES.rise,
        feel: STRING_FEEL.returnCut,
      },
    ],
  },
  sheathe: {
    id: "sheathe",
    name: "Sheathe",
    clip: "sheathe",
    pitch: 1.4,
    cancel: STRING_CANCEL.sheathe,
    hits: [
      {
        at: onFrame(9),
        box: [-4, -40, 28, 2],
        power: STRING_POWER.sheathe.now,
        kx: 30,
        ky: -20,
        feel: STRING_FEEL.sheathe,
      },
    ],
    afterHit: () => {
      sayaSound.click();
      sheatheFlash();
    },
  },
} satisfies Record<string, MoveDef>;
