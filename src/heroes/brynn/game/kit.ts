import { STRIDE } from "../../../constants/motion";
import { rechargeStep } from "../../../game/build/recharge";
import { isFree } from "../../../game/hero/actions";
import { blowsDone } from "../../../game/hero/combo";
import { resetMotion } from "../../../game/hero/motion";
import { hero } from "../../../game/state";
import type { HeroKit } from "../../../types/kit";
import { BRYNN_ABILITY_CLIPS } from "../constants/clips/abilities";
import { BRYNN_SLOTS, casting, rechargeAbilities, runAbility } from "./abilities";
import { afterStrike } from "./afterStrike";
import { hurtScale, steadfast } from "./armour";
import { chooseMove } from "./chooseMove";
import { BRYNN_GUARD } from "./guardStyle";
import { keenWindow } from "./heavy";
import { tickHeft } from "./heft";
import { brynnPose } from "./pose";
import { readActions } from "./readActions";
import { shapeHit } from "./shapeHit";
import { brynn, resetBrynnState } from "./state";
import { BRYNN_WARP } from "./warpStyle";

/** her ability may be cut by a shared action once it has left the blade */
function mayAct(): boolean {
  if (casting()) return hero.st >= BRYNN_ABILITY_CLIPS[hero.state as "rend" | "quake"].hit;
  return isFree() || blowsDone();
}

/**
 * Brynn: a slow three-blow string with armour while she swings, Heft built by every blow and spent in a fissure, heavy
 * swings on the Keen beat, a costly flat-blade guard whose parry is the Counter Cleave, a spinning warp throw, and
 * abilities that shake the floor and may be carried out of the string.
 */
export const BRYNN_KIT: HeroKit = {
  tick: (dt) => {
    rechargeAbilities(rechargeStep(dt));
    tickHeft(dt);
  },
  readActions,
  warp: BRYNN_WARP,
  guard: BRYNN_GUARD,
  abilities: BRYNN_SLOTS,
  chooseMove,
  runState: () => {
    if (!casting()) return false;
    runAbility();
    return true;
  },
  pose: brynnPose,
  afterStrike,
  shapeHit,
  keenWindow,
  mayAct,
  cutForAction: () => {
    brynn.carry = 0;
  },
  absorbHurt: () => false,
  steadfast,
  hurtScale,
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  drivesMotion: () => false,
  gravityScale: () => 1,
  reset: () => {
    resetMotion();
    resetBrynnState();
  },
};
