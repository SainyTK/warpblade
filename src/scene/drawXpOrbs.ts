import { XP_GLOW as X } from "../constants/palette";
import { glow, place, px } from "../engine/frame";
import { game } from "../game/state";
import { WHITE } from "../utils/color";

/** small diamonds of experience that pulse, lime so they read apart from coins and the green heal orbs */
export function drawXpOrbs(): void {
  place();
  for (const o of game.xpOrbs) {
    const x = Math.round(o.x);
    const y = Math.round(o.y) - 1;
    const bright = Math.sin(game.t * 9 + o.x * 0.5) > 0;
    px(x, y - 1, X[2]);
    px(x - 1, y, X[2]);
    px(x, y, bright ? WHITE : X[4]);
    px(x + 1, y, X[2]);
    px(x, y + 1, X[1]);
    glow(x, y, 6, X[3], bright ? 0.4 : 0.25);
  }
}
