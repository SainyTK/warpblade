import { STRIDE } from "../../../constants/motion";
import { usesDrill } from "../../../drill";
import { rechargeStep } from "../../../game/build/recharge";
import { resetMotion } from "../../../game/hero/motion";
import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { HeroKit } from "../../../types/kit";
import { drawAegis } from "./aegis";
import { afterStrike } from "./afterStrike";
import { tickChain } from "./blink";
import { hitBonus, takenBonus } from "./bonus";
import { chooseMove } from "./chooseMove";
import { drawCounter, openCounter, tickCounter } from "./counter";
import { KAEL_GUARD } from "./guardStyle";
import { alwaysKeen, keenWindow } from "./keen";
import { cutPassed, endPassingCut, startPassingCut } from "./passingCut";
import { kaelPose } from "./pose";
import { drawShards } from "./prism/shards";
import { readActions } from "./readActions";
import { shapeHit } from "./shapeHit";
import { drawCast, KAEL_SLOTS, rechargeSpells, runCast } from "./spell";
import { resetKaelState, tickKaelState } from "./state";
import { KAEL_WARP } from "./warpStyle";

/** Kael: a fixed sword string his skills reshape, the crystal sword's warp with crystal hangs, a sword guard whose
 *  parry cuts back and opens a counter blink, the shared dodge, and crystal and element abilities */
export const KAEL_KIT: HeroKit = {
  tick: (dt) => {
    rechargeSpells(rechargeStep(dt));
    tickKaelState(dt);
    tickChain(dt);
    tickCounter(dt);
  },
  readActions,
  warp: KAEL_WARP,
  guard: KAEL_GUARD,
  abilities: KAEL_SLOTS,
  chooseMove,
  // the cast is a shared state: his kit lets the ability loose in it, and the shared runner ends it
  runState: () => {
    if (hero.state === "cast") runCast();
    return false;
  },
  pose: kaelPose,
  afterStrike,
  shapeHit,
  keenWindow,
  alwaysKeen,
  absorbHurt: () => false,
  hitBonus,
  takenBonus,
  airDodge: () => !!skillValues("k_skydance").airDash,
  dodge: { started: startPassingCut, passed: cutPassed, ended: endPassingCut },
  draw: () => {
    if (usesDrill()) {
      drawAegis();
      return;
    }
    drawShards();
    drawCast();
    drawAegis();
    drawCounter();
  },
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  drivesMotion: () => false,
  gravityScale: () => 1,
  reset: () => {
    resetMotion();
    resetKaelState();
    openCounter(null);
  },
};
