import { HULDA_STRIDE } from "../../../constants/hulda/motion";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { take, use } from "../../input";
import { hero } from "../../state";
import { resetMotion } from "../kael/motion";
import { huldaCut, huldaMayAct } from "./act";
import { steadfast } from "./armour";
import { runBellow } from "./bellow";
import { clearClaims } from "./claims";
import { fistSteps, pressFist, runAirFist, runFist } from "./fists";
import { huldaDamageScale, tickFury } from "./fury";
import { gritScale, tickGrit } from "./grit";
import { HULDA_GUARD } from "./guardStyle";
import { drop, watchGrip } from "./hold";
import { runChain } from "./ironChain";
import { runBrace } from "./ironWall";
import { pressJump } from "./jump";
import { hulda, resetHulda } from "./memory";
import { huldaPose } from "./pose";
import { dropCarried, runRush } from "./rush";
import { rushDrives } from "./rushClock";
import { rustGuard } from "./rustGuard";
import { resetSettle } from "./settle";
import { ridesFoe, runRide, runSkyfall, skyfallDrives } from "./skyfall";
import { HULDA_SLOTS } from "./slots";
import { runTaunt } from "./taunt";
import { pressKnee, pressThrow, runHold, runKnee, runToss } from "./throws";
import { runStomp } from "./tremorStomp";
import { huldaWalkSpeed, tickPush } from "./walk";
import { HULDA_WARP } from "./warpStyle";

function tick(dt: number): void {
  tickGrit(dt);
  tickFury(dt);
  tickPush(dt);
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

/**
 * While a foe is in her hands she owns J and K: J tapped knees it, J held or K throws it (the side held picks the
 * throw); Up does nothing.
 */
function readHolding(dir: number): void {
  take("up");
  use("attack", pressKnee);
  use("warp", () => pressThrow(dir));
  use("guard", () => pressThrow(dir));
}

/**
 * Hulda: bare fists and iron gauntlets. A short three-blow string; a warp that throws her chained gauntlet and hauls her
 * in already holding the foe; an iron guard whose parry catches the attacker; knees and throws while she holds a foe;
 * Bull Rush, Bellow, the taunt and her spell skills on I; and Grit plates that take blows for her.
 */
export const HULDA_KIT: HeroKit = {
  warp: HULDA_WARP,
  guard: HULDA_GUARD,
  abilities: HULDA_SLOTS,
  mayAct: huldaMayAct,
  cutForAction: huldaCut,
  tick,
  readActions: (dir) => {
    if (hulda.held && (hero.state === "hold" || hero.state === "knee")) return readHolding(dir);
    use("up", pressJump);
    use("attack", () => pressFist(dir));
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
  walkSpeed: huldaWalkSpeed,
  hurtScale: () => gritScale() * rustGuard(),
  damageScale: huldaDamageScale,
  steadfast,
  drivesMotion: () =>
    rushDrives() ||
    skyfallDrives() ||
    ridesFoe() ||
    fistSteps() ||
    ((hero.state === "hold" || hero.state === "knee") && hero.ground),
  gravityScale: () => (ridesFoe() ? 0 : 1),
  reset: () => {
    drop();
    dropCarried();
    clearClaims();
    resetHulda();
    resetMotion();
    resetSettle();
  },
};
