import { ORRIN_STRIDE } from "../../../constants/orrin/motion";
import type { HeroKit } from "../../../types/kit";
import { rechargeStep } from "../../build/recharge";
import { isHeld, take, use } from "../../input";
import { hero } from "../../state";
import { settle } from "../actions";
import { resetMotion } from "../kael/motion";
import { travelEnded } from "../travelEnd";
import { ORRIN_SLOTS } from "./abilities";
import { arcsPerAir, pressAirArc, tickAirArc } from "./airArc";
import { runPin, tickPin } from "./anchorPin";
import { tickBind } from "./bind";
import { runClimb } from "./climb";
import { drawOrrin, drawOrrinBack, stepChainLoop } from "./draw";
import { runFly } from "./fly";
import { ORRIN_GUARD } from "./guardStyle";
import { hooksPerAir, pressSwingHook, runHookThrow } from "./hook";
import { pressJump } from "./jump";
import { cutOrrin, mayOrrinAct } from "./mayAct";
import { orrin, resetOrrin } from "./memory";
import { momentumScale, tickMomentum } from "./momentum";
import { runPendulum } from "./pendulum";
import { plumbHead, plumbLand, pressPlumb } from "./plumbDrop";
import { orrinPose } from "./pose";
import { absorbBlow } from "./slip";
import { pressString, runString } from "./string";
import { dropChain, endSwingOnFloor, holdReel, letGo, runSwing } from "./swing";
import { ORRIN_WARP } from "./warpStyle";
import { endWhirl, runWhirl } from "./whirlwall";

/** gravity while a hook flies from the air */
const AIR_THROW_GRAVITY = 0.3;

/** the side held now */
const heldSide = (): number => (isHeld("right") ? 1 : 0) - (isHeld("left") ? 1 : 0);

/** states in which the kit moves him itself, or keeps the speed he came in with */
const DRIVEN = new Set(["swing", "climb", "fly", "whirl", "pendulum"]);
/** states in which the kit's own physics replace gravity */
const WEIGHTLESS = new Set(["swing", "climb", "pendulum"]);

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
  orrin.sinceRelease += dt;
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
  tickBind(dt);
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
    case "climb":
      runClimb();
      return true;
    case "fly":
      runFly(dt, heldSide());
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
    default:
      return false;
  }
}

/** while he swings: jump lets go with a hop and a fling, Down drops with Plumb Drop, J tapped is the Hanging Arc, and J
 *  held reels the chain in; the shared moveset waits for him to let go */
function readSwinging(): void {
  use("up", () => {
    letGo(true);
    return true;
  });
  use("down", pressPlumb);
  use("attack", pressAirArc);
  if (take("warp")) holdReel();
}

/**
 * Orrin: a brass hook on a long chain. A three-blow chain string that hits hardest at the tip; J held throws the hook at
 * a foe and he lands on it with a flying kick that binds it, or with Up held hooks a crystal, a platform or the air and
 * swings; a spinning-chain guard whose parry, Chain Bind, hauls the attacker to his chain's tip; Whirlwall, Anchor Pin
 * and his spell skills on I; Grand Pendulum on U; and Momentum, filled by speed, on every hit he deals.
 */
export const ORRIN_KIT: HeroKit = {
  warp: ORRIN_WARP,
  guard: ORRIN_GUARD,
  abilities: ORRIN_SLOTS,
  tick,
  readActions: () => {
    if (hero.state === "swing") return readSwinging();
    use("up", pressJump);
    use("attack", () => (hero.ground ? pressString() : pressAirArc()));
    use("warp", pressSwingHook);
  },
  mayAct: mayOrrinAct,
  cutForAction: cutOrrin,
  chooseMove: () => null,
  runState,
  pose: orrinPose,
  afterStrike: () => {},
  absorbHurt: absorbBlow,
  stride: () => ORRIN_STRIDE,
  hurtScale: () => 1,
  damageScale: momentumScale,
  drivesMotion: () => DRIVEN.has(hero.state) || (hero.state === "hookThrow" && !hero.ground),
  gravityScale: () => {
    if (WEIGHTLESS.has(hero.state)) return 0;
    // a hook thrown in the air hangs him for the moment it flies, so a second bite can catch before he lands
    if (hero.state === "hookThrow" && !hero.ground) return AIR_THROW_GRAVITY;
    return 1;
  },
  drawBack: drawOrrinBack,
  draw: drawOrrin,
  reset: () => {
    dropChain();
    endWhirl();
    resetOrrin();
    resetMotion();
  },
};
