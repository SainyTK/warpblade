import { HULDA_STRIDE } from "../../../constants/hulda/motion";
import type { HeroKit } from "../../../types/kit";
import { take, use } from "../../input";
import { hero } from "../../state";
import { resetMotion } from "../kael/motion";
import { startCharge } from "../ultimate";
import { steadfast } from "./armour";
import { pressBellow, runBellow } from "./bellow";
import { clearClaims } from "./claims";
import { pressFist, runAirFist, runFist } from "./fists";
import { pressGrab, runCrush, runGrab } from "./grab";
import { gritScale, tickGrit } from "./grit";
import { drop, watchGrip } from "./hold";
import { pressJump } from "./jump";
import { hulda, resetHulda } from "./memory";
import { huldaPose } from "./pose";
import { dropCarried, pressRush, runRush, rushDrives } from "./rush";
import { pressSkyfall, runSkyfall, skyfallDrives } from "./skyfall";
import { pressTaunt, runTaunt } from "./taunt";
import { pressKnee, pressThrow, runHold, runKnee, runToss } from "./throws";

function tick(dt: number): void {
  tickGrit(dt);
  hulda.bellowCd = Math.max(0, hulda.bellowCd - dt);
  hulda.tauntCd = Math.max(0, hulda.tauntCd - dt);
  hulda.rushCd = Math.max(0, hulda.rushCd - dt);
  if (hero.state !== "fist") hulda.link = Math.max(0, hulda.link - dt);
  if (hero.state !== "fist" && hulda.link <= 0) hero.chain = 0;
  if (hero.ground && hero.state !== "skyfall") {
    hulda.airFisted = false;
    hulda.airGrabbed = false;
  }
  watchGrip();
  if (hulda.carried && (hero.state !== "rush" || hero.hp <= 0)) dropCarried();
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
    default:
      return false;
  }
}

/** while a foe is in her hands, J knees it, K throws it the way the keys ask, and Up only picks the throw */
function readHolding(dir: number): void {
  take("up");
  use("attack", pressKnee);
  use("warp", () => pressThrow(dir));
}

/**
 * Hulda: bare fists and iron gauntlets. A short four-blow string, grabs that hold minions and crush bigger foes, throws
 * by direction, an armoured Bull Rush, Bellow and a taunt, and Grit plates that take blows for her. She never dodges.
 */
export const HULDA_KIT: HeroKit = {
  tick,
  readActions: (dir) => {
    if (hulda.held && (hero.state === "hold" || hero.state === "knee")) return readHolding(dir);
    use("dash", pressRush);
    use("up", pressJump);
    use("attack", pressFist);
    use("warp", () => (hero.ground ? pressGrab() : pressSkyfall()));
    use("cast", pressBellow);
    use("cycle", pressTaunt);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: huldaPose,
  afterStrike: () => {},
  absorbHurt: () => false,
  stride: () => HULDA_STRIDE,
  hurtScale: gritScale,
  steadfast,
  drivesMotion: () =>
    rushDrives() || skyfallDrives() || ((hero.state === "hold" || hero.state === "knee") && hero.ground),
  gravityScale: () => 1,
  reset: () => {
    drop();
    dropCarried();
    clearClaims();
    resetHulda();
    resetMotion();
  },
};
