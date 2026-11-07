import { PERFECT, RIPOSTE, STAMINA } from "../../constants/combat";
import { FLOW } from "../../constants/growth";
import { sfx } from "../../services/audio";
import { addFlow } from "../build/flow";
import { cue } from "../cue";
import { createFloorRing } from "../effects/floorRing";
import { feat } from "../feat";
import { hasPerk } from "../progress";
import { emitSkillEvent } from "../skills/events";
import { game, hero, lights, progress } from "../state";
import { skin } from "./skin";
import { refundStamina } from "./stamina";

/**
 * The shared reward of a perfect dodge, for any kit whose evade met a blow at the right moment (Kael's dash, Sable's hop
 * or slide, Ysra's backstep): the feat, Flow stacks, slow motion, a little MP and stamina, the PERFECT cue, and the
 * skills' `perfectDodge` event. The kit keeps its own look and its own extras.
 */
export function rewardPerfectDodge(): void {
  const h = hero;
  feat({ kind: "perfect" });
  addFlow(FLOW.perfectDodge);
  game.slow = PERFECT.slow;
  h.mp = Math.min(progress.stats.mp, h.mp + PERFECT.mp);
  refundStamina(STAMINA.perfectRefund);
  cue(h.x, h.y - 36, "perfect");
  emitSkillEvent({ type: "perfectDodge", at: h.x });
}

/** an attack met Kael in the first moments of a dash: the shared reward, and with Riposte a primed counter */
export function perfectDodge(): void {
  const h = hero;
  if (h.state !== "dash" || h.st > PERFECT.window || h.perfectUsed) return;
  h.perfectUsed = true;
  rewardPerfectDodge();
  if (hasPerk("riposte")) h.riposte = RIPOSTE.time;
  game.fx.push(createFloorRing(h.x, h.y, 28, skin.ramp, 0.4));
  lights.add(h.x, h.y - 18, 50, skin.ramp[4], 0.7, 0.4);
  sfx.perfect();
}
