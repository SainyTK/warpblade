import { game } from "../game/state";
import { coinIcon } from "./coinIcon";
import { byId } from "./dom";

const el = byId("coinCount");
const count = document.createTextNode("0");
el.append(coinIcon(), count);
let shown = -1;

/** the coins picked up this run, in the HUD */
export function updateCoinCount(): void {
  if (game.coins === shown) return;
  shown = game.coins;
  count.data = String(game.coins);
}
