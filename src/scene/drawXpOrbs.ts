import { XP_ORB, XP_ORB_BRIGHT } from "../constants/effectColors";
import { XP_GLOW as X } from "../constants/palette";
import { LYING_PICKUP_LIFT, XP_ORB_PIXELS } from "../constants/pickupPixels";
import { glow, place } from "../engine/frame";
import { stampPixels } from "../game/effects/fine";
import { game } from "../game/state";

/** small cut gems of experience that pulse, lime so they read apart from coins and the green heal orbs */
export function drawXpOrbs(): void {
  place();
  for (const o of game.xpOrbs) {
    const y = o.y - LYING_PICKUP_LIFT;
    const bright = Math.sin(game.t * 9 + o.x * 0.5) > 0;
    stampPixels(XP_ORB_PIXELS, o.x, y, bright ? XP_ORB_BRIGHT : XP_ORB);
    glow(o.x, y, 6, X[3], bright ? 0.4 : 0.25);
  }
}
