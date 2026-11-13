import { CLIPS } from "../../../constants/clips";
import { WICK } from "../../../constants/wenna/wick";
import { place } from "../../../engine/frame";
import { game, hero } from "../../state";
import { drawGreatWick } from "./drawGreatWick";
import { drawWick } from "./drawWick";
import { drawDrips } from "./drips";
import { drawLantern } from "./lantern";
import { drawQuarries } from "./quarry";
import { drawHeldCandle } from "./thrownCandle";
import { ownWicks } from "./wickWorld";

/** a Wick standing as a Great Wick (her Great Wick skill) sways its arm in a slow beat */
const GREAT_BEAT = 1.4;

/** the candle in her far hand as she draws it back to throw, behind her body until it leaves her hand */
function heldCandle(): void {
  const h = hero;
  if (h.state !== "throw" || h.st >= CLIPS.throw.hit) return;
  drawHeldCandle(h.x + h.pose.bx * h.face, h.y + h.pose.by);
}

/** behind her: her drips, the candle she is about to throw, and her Wicks, a Wick nobody tends any more left out (its
 *  owner fell or left) */
export function drawWennaBack(): void {
  place();
  drawDrips();
  heldCandle();
  for (const w of ownWicks()) {
    if (w.melt < 0 && game.t - w.tended > WICK.untended) continue;
    if (w.great > 0 && w.melt < 0) {
      const swing = 0.5 + 0.5 * Math.sin(game.t * GREAT_BEAT * Math.PI * 2);
      drawGreatWick(w.x, w.y, 1, swing, 0, w.face);
      continue;
    }
    drawWick(w);
  }
}

/** over her: the lantern on her pole */
export function drawWenna(): void {
  drawLantern();
}

/** over the whole scene, past the damage numbers: the lamplight ring over each Quarry */
export function drawWennaOver(): void {
  drawQuarries();
}
