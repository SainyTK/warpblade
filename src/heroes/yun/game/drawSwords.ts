import { hero } from "../../../game/state";
import { drawSpiritSword } from "./art/spiritSword";
import { swordPlace } from "./hover";
import { drawScreenPlate, screenLook } from "./screen";
import { yun } from "./state";

/** the spirit swords he holds: in a fan behind his shoulders, or fanned out before him while he guards; a sword out on
 *  an echo thrust leaves its place empty. The screen is drawn over him (`front`) at full strength on a plate of light,
 *  the fan behind him */
export function drawHeldSwords(front: boolean): void {
  if (hero.state === "dead" || (hero.state === "guard") !== front) return;
  if (front) drawScreenPlate();
  const look = front ? screenLook() : undefined;
  for (let i = 0; i < yun.swords; i++) {
    if (yun.away[i] > 0) continue;
    const p = swordPlace(i, yun.swords);
    drawSpiritSword(p.x, p.y, p.angle, front ? 1 : 0.85, undefined, look);
  }
}
