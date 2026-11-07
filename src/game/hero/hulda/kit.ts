import { HULDA_STRIDE } from "../../../constants/hulda/motion";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { take, use } from "../../input";
import { hero } from "../../state";
import { resetMotion } from "../kael/motion";
import { startCharge } from "../ultimate";
import { nextAbility, pressAbility, resetAbilities } from "./abilities";
import { steadfast } from "./armour";
import { runBellow } from "./bellow";
import { clearClaims } from "./claims";
import { pressFist, runAirFist, runFist } from "./fists";
import { huldaDamageScale, tickFury } from "./fury";
import { pressGrab, runCrush, runGrab } from "./grab";
import { gritScale, tickGrit } from "./grit";
import { drop, watchGrip } from "./hold";
import { runChain } from "./ironChain";
import { runBrace } from "./ironWall";
import { pressJump } from "./jump";
import { hulda, resetHulda } from "./memory";
import { huldaPose } from "./pose";
import { dropCarried, pressRush, runRush } from "./rush";
import { rushDrives } from "./rushClock";
import { rustGuard } from "./rustGuard";
import { pressSkyfall, ridesFoe, runRide, runSkyfall, skyfallDrives } from "./skyfall";
import { runTaunt } from "./taunt";
import { pressKnee, pressThrow, runHold, runKnee, runToss } from "./throws";
import { runStomp } from "./tremorStomp";

function tick(dt: number): void {
  tickGrit(dt);
  tickFury(dt);
  const recharge = rechargeStep(dt);
  hulda.bellowCd = Math.max(0, hulda.bellowCd - recharge);
  hulda.tauntCd = Math.max(0, hulda.tauntCd - recharge);
  hulda.chainCd = Math.max(0, hulda.chainCd - recharge);
  hulda.stompCd = Math.max(0, hulda.stompCd - recharge);
  hulda.wallCd = Math.max(0, hulda.wallCd - recharge);
  hulda.rushCd = Math.max(0, hulda.rushCd - recharge);
  if (hero.state !== "fist") hulda.link = Math.max(0, hulda.link - dt);
  if (hero.state !== "fist" && hulda.link <= 0) hero.chain = 0;
  if (hero.ground && hero.state !== "skyfall") {
    hulda.airFisted = false;
    hulda.airGrabbed = false;
    hulda.bounced = false;
  }
  watchGrip();
  if (hulda.carried.length && (hero.state !== "rush" || hero.hp <= 0)) dropCarried();
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "fist":
      runFist(dt);
      return true;
    case "airFist":
      runAirFist();
      return true;
    case "grab":
      runGrab();
      return true;
    case "crush":
      runCrush();
      return true;
    case "hold":
      runHold(dt);
      return true;
    case "knee":
      runKnee(dt);
      return true;
    case "toss":
      runToss(dt);
      return true;
    case "skyfall":
      runSkyfall();
      return true;
    case "rush":
      runRush(dt);
      return true;
    case "bellow":
      runBellow();
      return true;
    case "taunt":
      runTaunt(dt);
      return true;
    case "chain":
      runChain();
      return true;
    case "stomp":
      runStomp();
      return true;
    case "brace":
      runBrace();
      return true;
    case "ride":
      runRide(dt);
      return true;
    default:
      return false;
  }
}

/** while a foe is in her hands, J knees it and K throws it, the throw picked by where the foes stand; Up does nothing */
function readHolding(): void {
  take("up");
  use("attack", pressKnee);
  use("warp", pressThrow);
}

/**
 * Hulda: bare fists and iron gauntlets. A short three-blow string, grabs that hold minions and crush bigger foes, throws
 * that pick themselves by where the foes stand, an armoured Bull Rush, Bellow, the taunt and her spell skills on I (O
 * turns through them), and Grit plates that take blows for her. She never dodges.
 */
export const HULDA_KIT: HeroKit = {
  tick,
  readActions: (dir) => {
    if (hulda.held && (hero.state === "hold" || hero.state === "knee")) return readHolding();
    use("dash", () => pressRush(dir));
    use("up", pressJump);
    use("attack", () => pressFist(dir));
    use("warp", () => (hero.ground ? pressGrab(dir) : pressSkyfall()));
    use("cast", pressAbility);
    use("cycle", nextAbility);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: huldaPose,
  afterStrike: () => {},
  absorbHurt: (_dmg, fromX) => {
    hulda.hitFrom = fromX;
    return false;
  },
  stride: () => HULDA_STRIDE,
  hurtScale: () => gritScale() * rustGuard(),
  damageScale: huldaDamageScale,
  steadfast,
  drivesMotion: () =>
    rushDrives() || skyfallDrives() || ridesFoe() || ((hero.state === "hold" || hero.state === "knee") && hero.ground),
  gravityScale: () => (ridesFoe() ? 0 : 1),
  reset: () => {
    drop();
    dropCarried();
    clearClaims();
    resetHulda();
    resetAbilities();
    resetMotion();
  },
};
