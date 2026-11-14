import { hero } from "../../../game/state";
import { drawSpiritSword } from "./art/spiritSword";
import { swordPlace } from "./hover";
import { yun } from "./state";

/** the spirit swords he holds: in a fan behind his shoulders, or fanned out before him while he guards; a sword out on
 *  an echo thrust leaves its place empty. The screen is drawn over him (`front`), the fan behind him */
export function drawHeldSwords(front: boolean): void {
  if (hero.state === "dead" || (hero.state === "guard") !== front) return;
  for (let i = 0; i < yun.swords; i++) {
    if (yun.away[i] > 0) continue;
    const p = swordPlace(i, yun.swords);
    drawSpiritSword(p.x, p.y, p.angle, 0.85);
  }
}
