import { COIN_BACK, COIN_FRONT } from "../constants/effectColors";
import { COIN_GOLD as G } from "../constants/palette";
import { COIN_SPIN, COIN_STEPS, COIN_TURNS } from "../constants/pickupPixels";
import { glow, place } from "../engine/frame";
import { stampPixels } from "../game/effects/fine";
import { game } from "../game/state";

/** round coins that spin through face, three quarters and edge, with a glint on the front face */
export function drawCoins(): void {
  place();
  for (const c of game.coinDrops) {
    const y = c.y - 0.5;
    const step = COIN_STEPS[Math.floor(game.t * COIN_SPIN + c.x * 0.37) % COIN_STEPS.length];
    stampPixels(COIN_TURNS[step.turn], c.x, y, step.front ? COIN_FRONT : COIN_BACK);
    glow(c.x, y, 5, G[3], 0.3);
  }
}
