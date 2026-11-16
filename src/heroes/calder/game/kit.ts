import { STRIDE } from "../../../constants/motion";
import { rechargeStep } from "../../../game/build/recharge";
import { resetMotion } from "../../../game/hero/motion";
import { hero } from "../../../game/state";
import type { HeroKit } from "../../../types/kit";
import { CALDER_SLOTS, rechargeShots, runShot, shotDrivesMotion } from "./abilities";
import { afterStrike } from "./afterStrike";
import { chamberSize } from "./chamber";
import { chooseMove } from "./chooseMove";
import { CALDER_GUARD } from "./guardStyle";
import { calderPose } from "./pose";
import { readActions } from "./readActions";
import { runReload } from "./reload";
import { drawReloadGlint } from "./reloadGlint";
import { calderCutForAction, calderHoldsPresses, calderMayAct } from "./sharedCut";
import { drumBonus } from "./skills/drumCylinder";
import { triggerWindow } from "./skills/hairTrigger";
import { RECOIL_DODGE, recoilAirDodge } from "./skills/recoilDash";
import { calder, resetCalderState, tickCalderState } from "./state";
import { runCylinderBreak } from "./ultimate/cylinderBreak";
import { CALDER_WARP } from "./warpStyle";

/** Calder's own states: the reload, a shot and the ultimate's run of cuts; false hands any other to the shared runner */
function runState(dt: number): boolean {
  switch (hero.state) {
    case "reload":
      runReload(dt);
      return true;
    case "shot":
      runShot();
      return true;
    case "cylinderBreak":
      runCylinderBreak();
      return true;
    default:
      return false;
  }
}

/** Calder: a heavy three-blow string whose Trigger fires a round into the wound, a chamber of rounds that reloads on J,
 *  the shared warp with a round on arrival, a guard whose parry is a counter shot, and shots on I */
export const CALDER_KIT: HeroKit = {
  tick: (dt) => {
    rechargeShots(rechargeStep(dt));
    tickCalderState(dt);
    if (hero.state !== "shot") calder.hopping = false;
    if (hero.state === "throw") {
      calder.warpFromX = hero.x;
      calder.warpFromY = hero.y - 18;
    }
  },
  readActions,
  warp: CALDER_WARP,
  guard: CALDER_GUARD,
  abilities: CALDER_SLOTS,
  chooseMove,
  runState,
  pose: calderPose,
  afterStrike,
  keenWindow: triggerWindow,
  mayAct: calderMayAct,
  cutForAction: calderCutForAction,
  holdsSharedPresses: calderHoldsPresses,
  hitBonus: drumBonus,
  airDodge: recoilAirDodge,
  dodge: RECOIL_DODGE,
  absorbHurt: () => false,
  draw: drawReloadGlint,
  stride: (running) => (running ? STRIDE.run : STRIDE.walk),
  hurtScale: () => 1,
  drivesMotion: shotDrivesMotion,
  gravityScale: () => 1,
  reset: () => {
    resetMotion();
    resetCalderState(chamberSize());
  },
};
