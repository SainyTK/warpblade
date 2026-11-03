import { COIN_GOLD as G } from "../constants/palette";
import { glow, place, px } from "../engine/frame";
import { game } from "../game/state";
import { WHITE } from "../utils/color";

/** 3 by 3 coins that spin: full face, edge on, then the face again, with a glint on the face */
export function drawCoins(): void {
  place();
  for (const c of game.coinDrops) {
    const x = Math.round(c.x);
    const y = Math.round(c.y) - 1;
    const turn = Math.floor(game.t * 8 + c.x * 0.37) % 4;
    if (turn === 1 || turn === 3) {
      px(x, y - 1, G[2]);
      px(x, y, G[3]);
      px(x, y + 1, G[1]);
    } else {
      px(x - 1, y - 1, G[2]);
      px(x, y - 1, turn === 0 ? WHITE : G[4]);
      px(x + 1, y - 1, G[2]);
      px(x - 1, y, G[2]);
      px(x, y, G[3]);
      px(x + 1, y, G[1]);
      px(x - 1, y + 1, G[1]);
      px(x, y + 1, G[1]);
      px(x + 1, y + 1, G[0]);
    }
    glow(x, y, 5, G[3], 0.3);
  }
}
