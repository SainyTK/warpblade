import { MP_SPEND_EPSILON } from "./constants";
import type { FighterProbe, PressAction } from "./types";

export function actionStarted(action: PressAction, prev: FighterProbe, cur: FighterProbe, base: FighterProbe): boolean {
  switch (action) {
    case "J":
      return cur.swing !== null && (prev.swing !== cur.swing || cur.swingAge < prev.swingAge);
    case "K":
      return cur.guard && !prev.guard;
    case "L":
      return cur.dash > 0 && (prev.dash === 0 || cur.dash > prev.dash);
    case "I":
      return (cur.release && !prev.release) || (cur.infusion && !prev.infusion) || cur.mp < prev.mp - MP_SPEND_EPSILON;
    case "U":
      return cur.warp !== null && prev.warp === null;
    case "jump":
      return cur.vy < 0 && (prev.ground || prev.vy >= 0) && cur.y < base.y;
  }
}
