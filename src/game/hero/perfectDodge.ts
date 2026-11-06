import { PERFECT, RIPOSTE, STAMINA } from "../../constants/combat";
import { sfx } from "../../services/audio";
import { cue } from "../cue";
import { createFloorRing } from "../effects/floorRing";
import { feat } from "../feat";
import { hasPerk } from "../progress";
import { game, hero, lights, progress } from "../state";
import { skin } from "./skin";
import { refundStamina } from "./stamina";

/** an attack met Kael in the first moments of a dash: slow motion, a little MP and stamina, and with Riposte a primed counter */
export function perfectDodge(): void {
  const h = hero;
  if (h.state !== "dash" || h.st > PERFECT.window || h.perfectUsed) return;
  h.perfectUsed = true;
  feat({ kind: "perfect" });
  game.slow = PERFECT.slow;
  h.mp = Math.min(progress.stats.mp, h.mp + PERFECT.mp);
  refundStamina(STAMINA.perfectRefund);
  if (hasPerk("riposte")) h.riposte = RIPOSTE.time;
  cue(h.x, h.y - 36, "perfect");
  game.fx.push(createFloorRing(h.x, h.y, 28, skin.ramp, 0.4));
  lights.add(h.x, h.y - 18, 50, skin.ramp[4], 0.7, 0.4);
  sfx.perfect();
}
