import { GROOVE } from "../../../constants/jory/beat";
import { JORY_STRIDE } from "../../../constants/jory/moves";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { isFree } from "../actions";
import { resetMotion } from "../kael/motion";
import { JORY_SLOTS, tickAbilities } from "./abilities";
import { addGroove, judgeKept, keptJWaiting, tier } from "./beat";
import { boomAbsorbs, runBoom, tickBoom } from "./boom";
import { runCast } from "./cast";
import { trailMallets } from "./crescendo";
import { drawJory, drawJoryFloor } from "./draw";
import { rolling, runDrumroll } from "./drumroll";
import { JORY_GUARD } from "./guardStyle";
import "./hooks";
import { pressJump } from "./jump";
import { jory, resetJory } from "./memory";
import { joryPose } from "./pose";
import { watchSharedPresses } from "./sharedPresses";
import { inRecovery, landed, pressDownstroke, pressString, runDownstroke, runString, tickLink } from "./string";
import { JORY_WARP } from "./warpStyle";

/** Encore: one blow taken at Crescendo every this many seconds costs no Groove */
const SHRUG_EVERY = 10;

/** a blow that took his HP costs Groove; Encore softens it, and at Crescendo shrugs one off now and then */
function watchHurt(dt: number): void {
  jory.shrugCd = Math.max(0, jory.shrugCd - dt);
  const lost = jory.lastHp >= 0 && hero.hp < jory.lastHp && hero.state !== "dead";
  jory.lastHp = hero.hp;
  if (!lost) return;
  const v = skillValues("j_encore");
  if (v.shrug && tier() >= 4 && jory.shrugCd <= 0) {
    jory.shrugCd = SHRUG_EVERY;
    return;
  }
  addGroove(-(v.hurt ?? -GROOVE.hurt));
}

function tick(dt: number): void {
  watchSharedPresses();
  tickBoom(dt);
  tickAbilities(rechargeStep(dt));
  tickLink(dt);
  if (hero.ground) landed();
  watchHurt(dt);
  trailMallets();
}

/** J: the mallet string on the floor, Downstroke in the air */
function pressMallets(): boolean {
  // a J during the flinch keeps time: judged at once, it stays in the buffer and starts a blow when the flinch ends
  if (hero.state === "hurt") {
    judgeKept();
    return false;
  }
  // the press kept from the flinch waits for the landing (startKeptJ), so it never turns into a Downstroke
  if (jory.keptJ >= 0 && !hero.ground) return true;
  return hero.ground ? pressString() : pressDownstroke();
}

/**
 * A J kept from the flinch: the knockback leaves him in the air, so it waits for the landing and opens the string with
 * Tap there, not a Downstroke; its time to lapse only runs once he is back on the floor.
 */
function startKeptJ(): void {
  if (!keptJWaiting()) return;
  if (hero.ground) pressString();
  else jory.keptJ = jory.clock;
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "mallet":
      runString(dt);
      return true;
    case "downstroke":
      runDownstroke(dt);
      return true;
    case "boom":
      runBoom();
      return true;
    case "abilityCast":
    case "spellCast":
      runCast();
      return true;
    case "drumroll":
      runDrumroll(dt);
      return true;
    default:
      return false;
  }
}

/** states in which the kit moves him itself */
const DRIVEN = new Set(["drumroll", "downstroke"]);

/** a blow meets him: nothing touches him through the Drumroll or an on-beat Boom's moment */
function absorbHurt(): boolean {
  if (rolling()) return true;
  if (hero.inv > 0) return false;
  return boomAbsorbs();
}

/** the shared moves (warp, guard, dodge, ability, special) may cut in when he is free or a blow has struck */
const mayAct = (): boolean => isFree() || inRecovery();

/** a shared move cuts his string: the queued blow is dropped, and the next J starts a new string */
function cutForAction(): void {
  jory.queued = false;
  jory.link = 0;
}

/** his walk: War March adds a little for each Groove tier */
const walkSpeed = (shared: number): number => shared * (1 + (skillValues("j_march").walk ?? 0) * tier());

/**
 * Jory: one beat for the whole run, seen at his feet, felt in his body and heard as a tick, that judges his presses. On
 * the beat his mallet blows are Accents, his warp arrives as one, his dodge and his Counterbeat build Groove, and Groove
 * raises his tempo; off the beat he is a big man with two sticks. Boom, Steady Hand, Thunder Skin and his spell skills
 * on I, Drumroll on U.
 */
export const JORY_KIT: HeroKit = {
  warp: JORY_WARP,
  guard: JORY_GUARD,
  abilities: JORY_SLOTS,
  tick,
  readActions: () => {
    use("up", pressJump);
    use("attack", pressMallets);
    if (hero.state !== "hurt") startKeptJ();
  },
  chooseMove: () => null,
  runState,
  pose: joryPose,
  afterStrike: () => {},
  mayAct,
  cutForAction,
  absorbHurt,
  walkSpeed,
  stride: () => JORY_STRIDE,
  hurtScale: () => 1,
  drivesMotion: () => DRIVEN.has(hero.state),
  gravityScale: () => 1,
  drawFloor: drawJoryFloor,
  draw: drawJory,
  reset: () => {
    resetJory();
    resetMotion();
  },
};
