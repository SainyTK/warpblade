import { WICK } from "../../../constants/wenna/wick";
import { place } from "../../../engine/frame";
import { game } from "../../state";
import { drawGreatWick } from "./drawGreatWick";
import { drawWick } from "./drawWick";
import { drawDrips } from "./drips";
import { drawLantern } from "./lantern";
import { wennaHost } from "./memory";
import { drawQuarries } from "./quarry";
import { swapGone } from "./swap";
import { ownWicks } from "./wickWorld";

/** a Great Wick of Thousand Candles sways its arm in a slow beat */
const GREAT_BEAT = 1.4;

/** behind her: her drips and her Wicks, a Wick nobody tends any more left out (its owner fell or left) */
export function drawWennaBack(): void {
  place();
  drawDrips();
  const gone = swapGone() ? wennaHost.swapWick : null;
  for (const w of ownWicks()) {
    if (w === gone) continue;
    if (w.melt < 0 && game.t - w.tended > WICK.untended) continue;
    if (w.great > 0 && w.melt < 0) {
      const swing = 0.5 + 0.5 * Math.sin(game.t * GREAT_BEAT * Math.PI * 2);
      drawGreatWick(w.x, w.y, 1, swing, 0, w.face);
      continue;
    }
    drawWick(w);
  }
}

/** over her: the lantern on her pole, gone with her mid-Swap */
export function drawWenna(): void {
  if (!swapGone()) drawLantern();
}

/** over the whole scene, past the damage numbers: the lamplight ring over each Quarry */
export function drawWennaOver(): void {
  drawQuarries();
}
