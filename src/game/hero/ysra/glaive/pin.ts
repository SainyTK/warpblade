import { ENEMIES } from "../../../../constants/enemies";
import { PIN } from "../../../../constants/ysra/glaive";
import { hasPerk } from "../../../progress";
import { game } from "../../../state";
import { createPinMark } from "./effects/pinMark";

/** Impale: every foe the blow just struck is pinned to the floor, held still and taking more damage for a while */
export function pinStruck(): void {
  if (!hasPerk("impale")) return;
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.swing !== game.swing) continue;
    e.pinned = PIN.time;
    e.vx = 0;
    if (ENEMIES[e.type].launchable) e.stun = Math.max(e.stun, PIN.time);
    game.fx.push(createPinMark(e));
  }
}
