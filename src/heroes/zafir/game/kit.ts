import { STRIDE } from "../../../constants/motion";
import { rechargeStep } from "../../../game/build/recharge";
import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { resetMotion } from "../../../game/hero/motion";
import { hero } from "../../../game/state";
import type { HeroKit } from "../../../types/kit";
import { SANDCAST } from "../constants/abilities";
import { rechargeAbilities, runSandcast, ZAFIR_SLOTS } from "./abilities";
import { afterStrike } from "./afterStrike";
import { chooseMove } from "./chooseMove";
import { resetCrescent } from "./crescent";
import { ZAFIR_GUARD } from "./guardStyle";
import { landed } from "./landed";
import { zafirPose } from "./pose";
import { readActions } from "./readActions";
import { hitBonus, takenBonus } from "./skillHooks";
import { slipInAir, slipPassed, slipStarted } from "./slip";
import { resetZafirState, zafir } from "./state";
import { keenWindow, shapeSpin } from "./stringSkills";
import { ZAFIR_WARP } from "./warpStyle";
import { drawRing, tickWhirl } from "./whirl";
import { drawWounds, shedDrops } from "./wounds";

/** the walk stride under a spin steps on with the ground he covers, backward when he backs away */
function stepStride(dt: number): void {
  if (hero.state !== "move" || !hero.ground) return;
  const step = (dt * hero.vx * hero.face) / STRIDE.walk;
  zafir.stride = (((zafir.stride + step) % 1) + 1) % 1;
}

/**
 * Zafir: a string of four spins he walks through, each cutting in front and behind; the Whirl that builds while he
 * keeps hitting and turns a ring of sand round him; wounds that bleed; a veil of sand whose parry leaves a mirage; a
 * spinning warp arrival; Sandspout and the crescent throw on I, which cut into the string and let it carry on.
 */
export const ZAFIR_KIT: HeroKit = {
  tick: (dt) => {
    rechargeAbilities(rechargeStep(dt));
    tickWhirl(dt);
    stepStride(dt);
    shedDrops();
  },
  readActions,
  warp: ZAFIR_WARP,
  guard: ZAFIR_GUARD,
  abilities: ZAFIR_SLOTS,
  chooseMove,
  runState: () => {
    if (hero.state !== "sandcast") return false;
    runSandcast();
    return true;
  },
  mayAct: () => (hero.state === "sandcast" ? hero.st >= SANDCAST.release : isFree() || blowsDone()),
  cutForAction: () => {
    zafir.castInString = false;
  },
  pose: zafirPose,
  afterStrike,
  shapeHit: shapeSpin,
  keenWindow,
  airDodge: slipInAir,
  dodge: { started: slipStarted, passed: slipPassed },
  absorbHurt: () => false,
  hitBonus,
  takenBonus,
  landed,
  drawBack: () => drawRing(false),
  draw: () => {
    drawRing(true);
    drawWounds();
  },
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  drivesMotion: () => false,
  gravityScale: () => 1,
  reset: () => {
    resetMotion();
    resetCrescent();
    resetZafirState();
  },
};
