import { STRIDE } from "../../../constants/kael/motion";
import type { HeroKit } from "../../../types/kit";
import { chooseMove } from "../../../utils/comboChoice";
import { registerDamageHooks } from "../../damageHooks";
import { readActions } from "../readActions";
import { KAEL_SLOTS } from "../spell";
import { drawAegis } from "./aegis";
import { afterStrike } from "./afterStrike";
import { tickChain } from "./blink";
import { hitBonus, takenBonus } from "./bonus";
import { drawCounter, openCounter, tickCounter } from "./counter";
import { KAEL_GUARD } from "./guardStyle";
import { alwaysKeen, keenWindow } from "./keen";
import { resetMotion } from "./motion";
import { kaelPose } from "./pose";
import { shapeHit } from "./shapeHit";
import { resetKaelState, tickKaelState } from "./state";
import { KAEL_WARP } from "./warpStyle";

registerDamageHooks("kael", { hitBonus, takenBonus });

/** Kael: a fixed sword string his skills reshape, the crystal sword's warp with crystal hangs, a sword guard whose
 *  parry cuts back and opens a counter blink, the shared dodge, and crystal and element abilities */
export const KAEL_KIT: HeroKit = {
  tick: (dt) => {
    tickKaelState(dt);
    tickChain(dt);
    tickCounter(dt);
  },
  readActions,
  warp: KAEL_WARP,
  guard: KAEL_GUARD,
  abilities: KAEL_SLOTS,
  chooseMove,
  runState: () => false,
  pose: kaelPose,
  afterStrike,
  shapeHit,
  keenWindow,
  alwaysKeen,
  absorbHurt: () => false,
  draw: () => {
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
