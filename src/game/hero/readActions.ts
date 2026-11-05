import { LAUNCH_WAIT_STEPS } from "../../constants/input";
import { sfx } from "../../services/audio";
import { isHeld, pressAge, take, use } from "../input";
import { hasPerk } from "../progress";
import { hero, progress } from "../state";
import { isFree } from "./actions";
import { blowsDone, comboOpen, endCombo, pressAttack, startMove } from "./combo";
import { tryDash } from "./dash";
import { deny } from "./deny";
import { jump } from "./jump";
import { castCost, isRecharging, learnedElements, selectNextElement, startCast } from "./spell";
import { startCharge } from "./ultimate";
import { blink, startThrow, warpCost } from "./warp";

/** Up: Skybreaker after the third hit, otherwise a jump; with Launcher, it waits a moment for J, and as long as Up is held */
function pressUp(): boolean {
  if (hasPerk("skybreaker") && comboOpen(3)) {
    startMove("skybreaker");
    return true;
  }
  const inCombo = hero.state === "move" || (hero.link > 0 && hero.chain > 0);
  const mayLaunch = hasPerk("launcher") && inCombo && hero.ground && hero.chain < progress.comboLimit;
  if (mayLaunch && (pressAge("up") < LAUNCH_WAIT_STEPS || isHeld("up"))) return false;
  return jump();
}

/** a double tap: Phase Finish after the third hit, otherwise start running */
function doubleTap(dir: number): void {
  if (hasPerk("phaseFinish") && comboOpen(3)) {
    startMove(dir === hero.face ? "phaseCut" : "backflip");
    return;
  }
  if (isFree() && hero.ground) {
    hero.running = true;
    hero.face = dir;
  }
}

/** K: Blink Combo after two hits, otherwise a warp throw. Both share the warp's recharge.
 *  A press while the warp recharges is refused with a tick at once, whatever Kael is doing; so is one short of MP when he could warp. */
function pressWarp(): boolean {
  const h = hero;
  // the warp is learned from a pick; until then K does nothing
  if (!hasPerk("warpStrike")) return true;
  if (h.warpCd > 0) {
    deny("warp");
    return true;
  }
  if (hasPerk("blinkCombo") && comboOpen(2) && h.mp >= warpCost() / 2) {
    h.move = null;
    endCombo(true);
    if (blink()) return true;
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

/** I: Spellblade after two hits, otherwise a normal cast.
 *  A press while the element recharges is refused with a tick at once, whatever Kael is doing; so is one short of MP when he could cast. */
function pressCast(): boolean {
  // spells are learned from picks; until one is, I does nothing
  if (!learnedElements().length) return true;
  const spellblade = hasPerk("spellblade") && comboOpen(2);
  if (isRecharging()) deny("cast");
  else if (!spellblade && !isFree() && hero.state !== "hang") return false;
  else if (hero.mp < castCost()) deny("mp");
  else startCast(spellblade);
  return true;
}

/** use waiting presses in a fixed order: dash first so it can cancel, then up, taps, attack, warp, spell, ultimate.
 *  A press that cannot act yet stays buffered for a moment. */
export function readActions(dir: number, tap: number): void {
  use("dash", () => tryDash(dir));
  use("up", pressUp);
  if (tap) doubleTap(tap);
  use("attack", pressAttack);
  use("warp", pressWarp);
  use("cast", pressCast);
  use("ultimate", startCharge);
  if (take("cycle") && selectNextElement()) sfx.pickup();
}
