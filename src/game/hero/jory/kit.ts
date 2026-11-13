import { GROOVE } from "../../../constants/jory/beat";
import { JORY_STRIDE } from "../../../constants/jory/moves";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { use } from "../../input";
import { skillValues } from "../../skills/query";
import { hero } from "../../state";
import { resetMotion } from "../kael/motion";
import { startCharge } from "../ultimate";
import { nextAbility, pressAbility, resetAbilities, tickAbilities } from "./abilities";
import { addGroove, judgeKept, keptJWaiting, tier } from "./beat";
import { boomAbsorbs, pressBoom, runBoom, tickBoom } from "./boom";
import { runCast } from "./cast";
import { trailMallets } from "./crescendo";
import { drawJory, drawJoryFloor } from "./draw";
import { rolling, runDrumroll } from "./drumroll";
import "./hooks";
import { PROVISIONAL_GUARD, PROVISIONAL_WARP } from "../provisionalMoveset";
import { pressJump } from "./jump";
import { jory, resetJory } from "./memory";
import { joryPose } from "./pose";
import { pressStep, runStep, sliding, stepAbsorbs, tickStep } from "./step";
import { landed, pressDownstroke, pressString, runDownstroke, runString, tickLink } from "./string";

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
  tickBoom(dt);
  tickStep(dt);
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
    case "beatStep":
      runStep();
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
const DRIVEN = new Set(["beatStep", "drumroll", "downstroke"]);

/** a blow meets him: nothing touches him through the Drumroll, an on-beat Boom's moment or an on-beat step */
function absorbHurt(): boolean {
  if (rolling()) return true;
  if (hero.inv > 0) return false;
  return boomAbsorbs() || stepAbsorbs();
}

/** his walk: War March adds a little for each Groove tier */
const walkSpeed = (shared: number): number => shared * (1 + (skillValues("j_march").walk ?? 0) * tier());

/**
 * Jory: one beat for the whole run, seen at his feet, felt in his body and heard as a tick, that judges every press of
 * J, K, L and I. On the beat his mallet blows are Accents, his Boom (K) drowns shots and his Beat Step (L) cannot be
 * touched, and Groove builds, raising his tempo; off the beat he is a big man with two sticks. Steady Hand and Thunder
 * Skin on I (O turns through them and his spell skills), and Drumroll on U.
 */
export const JORY_KIT: HeroKit = {
  warp: PROVISIONAL_WARP,
  guard: PROVISIONAL_GUARD,
  abilities: [],
  tick,
  readActions: (dir) => {
    use("dash", () => pressStep(dir));
    use("up", pressJump);
    use("attack", pressMallets);
    if (hero.state !== "hurt") startKeptJ();
    use("warp", pressBoom);
    use("cast", pressAbility);
    use("cycle", nextAbility);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: joryPose,
  afterStrike: () => {},
  absorbHurt,
  walkSpeed,
  stride: () => JORY_STRIDE,
  hurtScale: () => 1,
  drivesMotion: () => DRIVEN.has(hero.state),
  gravityScale: () => (sliding() && !hero.ground ? 0 : 1),
  drawFloor: drawJoryFloor,
  draw: drawJory,
  reset: () => {
    resetJory();
    resetAbilities();
    resetMotion();
  },
};
