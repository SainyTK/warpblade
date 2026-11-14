import { STRIDE } from "../../../constants/motion";
import { rechargeStep } from "../../../game/build/recharge";
import { resetMotion } from "../../../game/hero/motion";
import { skillValues } from "../../../game/skills/query";
import { hero } from "../../../game/state";
import type { HeroKit } from "../../../types/kit";
import { TEMPO } from "../constants/tempo";
import { drawWeave, rechargeAbilities, runWeave, VESPER_SLOTS } from "./abilities";
import { afterStrike } from "./afterStrike";
import { hitBonus, takenBonus } from "./bonus";
import { chooseMove } from "./chooseMove";
import { VESPER_GUARD } from "./guardStyle";
import { vesperPose } from "./pose";
import { readActions } from "./readActions";
import { shapeHit } from "./shapeHit";
import { airDodge } from "./skills/ascendingStep";
import { graceScale, graceWard, tickWard } from "./skills/grace";
import { keenWindow } from "./skills/keen";
import { SLIPSTREAM } from "./skills/slipstream";
import { resetTwinCount } from "./skills/twinPhantom";
import { resetVesperState, tickVesperState, vesper } from "./state";
import { runStitch } from "./stitch";
import { clearStruck, noteStruck } from "./struck";
import { loseTempoToHurt, tempoTop, tickTempo } from "./tempo";
import { VESPER_WARP } from "./warpStyle";

/** a blow taken is seen by her HP falling between steps, and costs Tempo */
function watchHurt(): void {
  if (hero.hp < vesper.hp) loseTempoToHurt();
  vesper.hp = hero.hp;
}

/** her walk: the shared speed, faster with each Tempo stack and at the top with Unbroken Rhythm */
function walkSpeed(speed: number): number {
  const top = tempoTop() ? (skillValues("ve_rhythm").topMove ?? 0) : 0;
  return speed * (1 + vesper.tempo * TEMPO.walk + top);
}

/**
 * Vesper: a fixed string of paired blows that Tempo speeds up, the longest air string, a thrown long blade that she
 * follows to land a two-blade cross, crossed blades whose parry opens the foes, and abilities she can weave into the
 * string without breaking it.
 */
export const VESPER_KIT: HeroKit = {
  tick: (dt) => {
    clearStruck();
    rechargeAbilities(rechargeStep(dt));
    tickVesperState(dt);
    tickTempo(dt);
    tickWard(dt);
    watchHurt();
  },
  readActions,
  warp: VESPER_WARP,
  guard: VESPER_GUARD,
  abilities: VESPER_SLOTS,
  chooseMove,
  runState: (dt) => {
    if (hero.state === "weave") runWeave();
    else if (hero.state === "stitch") runStitch(dt);
    else return false;
    return true;
  },
  pose: vesperPose,
  afterStrike,
  shapeHit,
  keenWindow,
  attackRate: () => 1 + vesper.tempo * TEMPO.speed,
  walkSpeed,
  absorbHurt: () => graceWard(),
  hitBonus,
  takenBonus,
  landed: (e) => noteStruck(e),
  airDodge,
  dodge: SLIPSTREAM,
  draw: drawWeave,
  heroAlpha: () => (vesper.fade > 0 ? 0.35 : 1),
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: graceScale,
  drivesMotion: () => hero.state === "weave" || hero.state === "stitch",
  gravityScale: () => (hero.state === "stitch" ? 0 : hero.state === "weave" && !hero.ground && hero.vy >= 0 ? 0.3 : 1),
  reset: () => {
    resetMotion();
    resetVesperState();
    resetTwinCount();
    clearStruck();
  },
};
