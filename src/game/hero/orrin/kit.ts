import { ORRIN_STRIDE } from "../../../constants/orrin/motion";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { isHeld, take, use } from "../../input";
import { hero } from "../../state";
import { settle } from "../actions";
import { resetMotion } from "../kael/motion";
import { travelEnded } from "../travelEnd";
import { startCharge } from "../ultimate";
import { nextAbility, pressAbility, resetAbilities } from "./abilities";
import { arcsPerAir, pressAirArc, tickAirArc } from "./airArc";
import { runPin, tickPin } from "./anchorPin";
import { pressBackline, runBackline } from "./backline";
import { drawOrrin, drawOrrinBack, stepChainLoop } from "./draw";
import { runFly } from "./fly";
import { hooksPerAir, pressHook, runHookThrow } from "./hook";
import { pressJump } from "./jump";
import { runMaelstrom } from "./maelstrom";
import { orrin, resetOrrin } from "./memory";
import { momentumScale, tickMomentum } from "./momentum";
import { runPendulum } from "./pendulum";
import { plumbHead, plumbLand, pressPlumb } from "./plumbDrop";
import { orrinPose } from "./pose";
import { absorbBlow } from "./slip";
import { pressString, runString } from "./string";
import { dropChain, endSwingOnFloor, letGo, runSwing } from "./swing";
import { endWhirl, runWhirl } from "./whirlwall";
import { runZip } from "./zip";

/** the side held now */
const heldSide = (): number => (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);

/** states in which the kit moves him itself */
const DRIVEN = new Set(["swing", "zip", "fly", "backline", "whirl", "pendulum", "maelstrom"]);
/** states in which the kit's own physics replace gravity */
const WEIGHTLESS = new Set(["swing", "zip", "pendulum", "maelstrom"]);

/** a landing ends a swing or a flight; a Plumb Drop sets off its ring, a fling answers Aftershock */
function watchFloor(): void {
  const h = hero;
  if (!h.ground) return;
  orrin.hooks = hooksPerAir();
  orrin.airArcs = arcsPerAir();
  if (h.state === "swing") {
    if (orrin.yankTo) return;
    endSwingOnFloor();
    settle();
  } else if (h.state === "fly") {
    if (orrin.plumb) plumbLand(false);
    if (orrin.flung) travelEnded();
    orrin.flung = false;
    settle();
  }
}

function tick(dt: number): void {
  const h = hero;
  tickMomentum(dt);
  const recharge = rechargeStep(dt);
  orrin.whirlCd = Math.max(0, orrin.whirlCd - recharge);
  orrin.pinCd = Math.max(0, orrin.pinCd - recharge);
  orrin.fenceCd = Math.max(0, orrin.fenceCd - recharge);
  orrin.tetherCd = Math.max(0, orrin.tetherCd - recharge);
  orrin.anchorCd = Math.max(0, orrin.anchorCd - recharge);
  orrin.backlineCd = Math.max(0, orrin.backlineCd - dt);
  orrin.sinceRelease += dt;
  orrin.boostLeft = Math.max(0, orrin.boostLeft - dt);
  // Undertow's boost rides on a hook thrown in its window until that swing lets go
  const hooked = h.state === "hookThrow" || h.state === "swing";
  if (orrin.boostLeft <= 0 && !hooked) orrin.flingBoost = 0;
  if (h.state !== "lash") orrin.link = Math.max(0, orrin.link - dt);
  if (h.state !== "lash" && orrin.link <= 0) h.chain = 0;
  if (h.state === "hurt" || h.state === "dead") {
    if (orrin.latch || orrin.flight) dropChain();
    endWhirl();
    orrin.plumb = false;
    orrin.arc = -1;
  }
  if (h.state === "fly" && plumbHead()) settle();
  watchFloor();
  tickAirArc(dt);
  tickPin(dt);
  stepChainLoop(dt);
}

function runState(dt: number): boolean {
  switch (hero.state) {
    case "lash":
      runString(dt);
      return true;
    case "hookThrow":
      runHookThrow(dt);
      return true;
    case "swing":
      runSwing(dt, heldSide());
      return true;
    case "zip":
      runZip();
      return true;
    case "fly":
      runFly(dt, heldSide());
      return true;
    case "backline":
      runBackline(dt);
      return true;
    case "whirl":
      runWhirl();
      return true;
    case "pin":
      runPin();
      return true;
    case "pendulum":
      runPendulum(dt);
      return true;
    case "maelstrom":
      runMaelstrom(dt);
      return true;
    default:
      return false;
  }
}

/** while he swings: Up lets go with a hop, Down drops with Plumb Drop, J is the Hanging Arc */
function readSwinging(): void {
  use("up", () => {
    letGo(true);
    return true;
  });
  use("down", pressPlumb);
  use("attack", pressAirArc);
  take("cast");
}

/**
 * Orrin: a brass hook on a long chain. A three-blow chain string that hits hardest at the tip, a hook that zips him to
 * a foe or swings him under a crystal, a platform or the air itself, a reel and a Backline on L, Whirlwall and Anchor
 * Pin on I (O turns through them and his spell skills), and Momentum, filled by speed, on every hit he deals.
 */
export const ORRIN_KIT: HeroKit = {
  tick,
  readActions: () => {
    if (hero.state === "swing") return readSwinging();
    use("dash", pressBackline);
    use("up", pressJump);
    use("attack", () => (hero.ground ? pressString() : pressAirArc()));
    use("warp", pressHook);
    use("cast", pressAbility);
    use("cycle", nextAbility);
    use("ultimate", startCharge);
  },
  chooseMove: () => null,
  runState,
  pose: orrinPose,
  afterStrike: () => {},
  absorbHurt: absorbBlow,
  stride: () => ORRIN_STRIDE,
  hurtScale: () => 1,
  damageScale: momentumScale,
  drivesMotion: () => DRIVEN.has(hero.state) || (hero.state === "hookThrow" && !hero.ground),
  gravityScale: () => (WEIGHTLESS.has(hero.state) ? 0 : 1),
  drawBack: drawOrrinBack,
  draw: drawOrrin,
  reset: () => {
    dropChain();
    endWhirl();
    resetOrrin();
    resetAbilities();
    resetMotion();
  },
};
