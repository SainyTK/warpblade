import { DAMAGE } from "../../../constants/combat";
import type { HeroKit } from "../../../types/kit";
import { chooseMove } from "../../../utils/comboChoice";
import { hasPerk } from "../../progress";
import { readActions } from "../readActions";

/** Kael: a warp throw, a dash nothing can touch, crystal hangs, element spells and a situational sword string */
export const KAEL_KIT: HeroKit = {
  tick: () => {},
  readActions,
  chooseMove,
  runState: () => false,
  pose: () => null,
  afterStrike: () => {},
  absorbHurt: () => false,
  hurtScale: () => (hasPerk("ironWill") ? DAMAGE.ironWill : 1),
  drivesMotion: () => false,
  gravityScale: () => 1,
  reset: () => {},
};
