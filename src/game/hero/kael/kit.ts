import { DAMAGE } from "../../../constants/combat";
import { STRIDE } from "../../../constants/kael/motion";
import type { HeroKit } from "../../../types/kit";
import { chooseMove } from "../../../utils/comboChoice";
import { hasPerk } from "../../progress";
import { readActions } from "../readActions";
import { resetMotion } from "./motion";
import { kaelPose } from "./pose";
import { windupRate } from "./windup";

/** Kael: a warp throw, a dash nothing can touch, crystal hangs, element spells and a situational sword string */
export const KAEL_KIT: HeroKit = {
  tick: () => {},
  readActions,
  attackRate: windupRate,
  chooseMove,
  runState: () => false,
  pose: kaelPose,
  afterStrike: () => {},
  absorbHurt: () => false,
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => (hasPerk("ironWill") ? DAMAGE.ironWill : 1),
  drivesMotion: () => false,
  gravityScale: () => 1,
  reset: resetMotion,
};
