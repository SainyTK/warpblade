import { CLIPS } from "../../constants/clips";
import { BLINK_COST, COMBO } from "../../constants/combat";
import { use } from "../input";
import { skillLevel } from "../skills/query";
import { hero } from "../state";
import { isFree } from "./actions";
import { comboOpen, endCombo, pressAttack } from "./combo";
import { jump } from "./jump";
import { blink } from "./kael/blink";
import { pressCounter } from "./kael/counter";
import { kael } from "./kael/state";
import { warpCost, warpReady } from "./warp";

/** a double tap starts a run */
function doubleTap(dir: number): void {
  if (!isFree() || !hero.ground) return;
  hero.running = true;
  hero.face = dir;
}

/** Blink Step can step through now: after a hit of an open combo, its own recharge or a warp charge ready, MP for it */
function mayBlink(): boolean {
  if (!skillLevel("k_blink") || !comboOpen(1)) return false;
  if (hero.mp < warpCost() * BLINK_COST) return false;
  return kael.blinkCd <= 0 && (skillLevel("k_blink") >= 6 || warpReady());
}

/** J held in an open combo with Blink Step: no throw, Kael steps through to the foe's back; otherwise the shared warp */
function pressBlink(): boolean {
  if (!mayBlink()) return false;
  const h = hero;
  const keen = h.keenOpen > 0 || h.keenNext;
  // from Blink Step's second level the combo goes on from the foe's back; before it, the blink ends it
  const keep = skillLevel("k_blink") >= 2;
  h.move = null;
  h.queued = null;
  if (!keep) endCombo(true);
  if (blink(keen)) {
    if (keep) h.link = CLIPS.warpStrike.dur + COMBO.link;
    return true;
  }
  if (keep) endCombo(true);
  return false;
}

/** Kael's own presses: jump, a double tap to run, J tapped for the counter a parry opened or else the sword string, and
 *  Blink Step on J held mid-combo. The shared moveset (warp, guard, dodge, abilities, ultimate) is read by updateHero. */
export function readActions(_dir: number, tap: number): void {
  use("up", jump);
  if (tap) doubleTap(tap);
  use("attack", pressCounter);
  use("attack", pressAttack);
  use("warp", pressBlink);
}
