import { ELEMENTS } from "../../constants/combat";
import { LAUNCH_WAIT_STEPS } from "../../constants/input";
import { sfx } from "../../services/audio";
import { pressAge, take, use } from "../input";
import { hasPerk } from "../progress";
import { game, hero, progress } from "../state";
import { isFree } from "./actions";
import { blowsDone, comboOpen, endCombo, pressAttack, startMove } from "./combo";
import { tryDash } from "./dash";
import { jump } from "./jump";
import { castCost, denyCast, isRecharging, startCast } from "./spell";
import { startCharge } from "./ultimate";
import { blink, canWarp, startThrow, warpCost } from "./warp";

/** Up: Skybreaker after the third hit, otherwise a jump; with Launcher, a moment's wait in case J follows */
function pressUp(): boolean {
  if (hasPerk("skybreaker") && comboOpen(3)) {
    startMove("skybreaker");
    return true;
  }
  const inCombo = hero.state === "move" || (hero.link > 0 && hero.chain > 0);
  const mayLaunch = hasPerk("launcher") && inCombo && hero.ground && hero.chain < progress.comboLimit;
  if (mayLaunch && pressAge("up") < LAUNCH_WAIT_STEPS) return false;
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

/** K: Blink Combo after two hits, otherwise a warp throw */
function pressWarp(): boolean {
  const h = hero;
  if (hasPerk("blinkCombo") && comboOpen(2) && h.mp >= warpCost() / 2) {
    h.move = null;
    endCombo(true);
    if (blink()) return true;
  }
  if (!canWarp() || !(isFree() || h.state === "hang" || blowsDone())) return false;
  h.move = null;
  endCombo(false);
  startThrow();
  return true;
}

/** I: Spellblade after two hits, otherwise a normal cast.
 *  A press while the element recharges is refused with a tick at once, whatever Kael is doing; so is one short of MP when he could cast. */
function pressCast(): boolean {
  const spellblade = hasPerk("spellblade") && comboOpen(2);
  if (isRecharging()) denyCast();
  else if (!spellblade && !isFree() && hero.state !== "hang") return false;
  else if (hero.mp < castCost()) denyCast();
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
  if (take("cycle")) {
    game.spell = (game.spell + 1) % ELEMENTS.length;
    sfx.pickup();
  }
}
