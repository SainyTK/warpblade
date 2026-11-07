import { CLIPS } from "../../constants/clips";
import { BLINK_COST, COMBO } from "../../constants/combat";
import { SPELLBLADE } from "../../constants/spells";
import { sfx } from "../../services/audio";
import { take, use } from "../input";
import { skillLevel } from "../skills/query";
import { hero } from "../state";
import { isFree } from "./actions";
import { blowsDone, comboOpen, endCombo, pressAttack } from "./combo";
import { tryDash } from "./dash";
import { deny } from "./deny";
import { jump } from "./jump";
import { kael } from "./kael/state";
import { castCost, isRecharging, selectNextAbility, startCast } from "./spell";
import { startCharge } from "./ultimate";
import { blink, startThrow, warpCost, warpReady } from "./warp";

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

/** K: Blink Step during a combo, otherwise a warp throw. A press while the warp recharges is refused with a tick at
 *  once, whatever Kael is doing; so is one short of MP when he could warp. */
function pressWarp(): boolean {
  const h = hero;
  if (mayBlink()) {
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
  }
  if (!warpReady()) {
    deny("warp");
    return true;
  }
  if (!(isFree() || h.state === "hang" || blowsDone())) return false;
  if (h.mp < warpCost()) {
    deny("mp");
    return true;
  }
  h.move = null;
  endCombo(false);
  startThrow();
  return true;
}

/** I: Spellblade after the second hit of a combo, otherwise a normal cast.
 *  A press while the ability recharges is refused with a tick at once, whatever Kael is doing; so is one short of MP. */
function pressCast(): boolean {
  const spellblade = comboOpen(SPELLBLADE.after);
  if (isRecharging()) deny("cast");
  else if (!spellblade && !isFree() && hero.state !== "hang") return false;
  else if (hero.mp < castCost()) deny("mp");
  else startCast(spellblade);
  return true;
}

/** use waiting presses in a fixed order: dash first so it can cancel, then up, taps, attack, warp, cast, ultimate.
 *  A press that cannot act yet stays buffered for a moment. */
export function readActions(dir: number, tap: number): void {
  use("dash", () => tryDash(dir));
  use("up", jump);
  if (tap) doubleTap(tap);
  use("attack", pressAttack);
  use("warp", pressWarp);
  use("cast", pressCast);
  use("ultimate", startCharge);
  if (take("cycle") && selectNextAbility()) sfx.pickup();
}
