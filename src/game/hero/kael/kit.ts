import { STRIDE } from "../../../constants/kael/motion";
import type { HeroKit } from "../../../types/kit";
import { chooseMove } from "../../../utils/comboChoice";
import { registerDamageHooks } from "../../damageHooks";
import { readActions } from "../readActions";
import { resetAbilities } from "../spell";
import { tickWarp } from "../warp";
import { afterStrike } from "./afterStrike";
import { hitBonus, takenBonus } from "./bonus";
import { alwaysKeen, keenWindow } from "./keen";
import { resetMotion } from "./motion";
import { kaelPose } from "./pose";
import { shapeHit } from "./shapeHit";
import { resetKaelState, tickKaelState } from "./state";
import { windupRate } from "./windup";

registerDamageHooks("kael", { hitBonus, takenBonus });

/** Kael: a warp throw, a dash nothing can touch, crystal hangs, a rotation of crystal and element abilities and a
 *  situational sword string his skills reshape */
export const KAEL_KIT: HeroKit = {
  tick: (dt) => {
    tickKaelState(dt);
    tickWarp(dt);
  },
  readActions,
  attackRate: windupRate,
  chooseMove,
  runState: () => false,
  pose: kaelPose,
  afterStrike,
  shapeHit,
  keenWindow,
  alwaysKeen,
  absorbHurt: () => false,
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  drivesMotion: () => false,
  gravityScale: () => 1,
  reset: () => {
    resetMotion();
    resetKaelState();
    resetAbilities();
  },
};
