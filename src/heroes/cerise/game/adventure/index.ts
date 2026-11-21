import { isFree } from "../../../../game/hero/actions";
import { blowsDone } from "../../../../game/hero/combo";
import { holdGuard, pressEnhancedGuard, pressGuard } from "../../../../game/hero/heroGuard";
import { pressWarp, warpCost, warpReady } from "../../../../game/hero/warp";
import { take, use } from "../../../../game/input";
import { hero } from "../../../../game/state";
import { CHAIN } from "../../../../kaelDrill/constants";
import { readAttack } from "../readActions";
import { cancelTempestHold, readTempest } from "./charge";
import { resetCutIn } from "./cutIn";
import { resetInfusion } from "./infusion";
import { readMotion, resetMotion } from "./motion";
import { readPreparation, resetPreparation } from "./preparation";

export {
  cancelTempestHold,
  drawTempestCharge,
  releaseTempestHold,
  startTempestHold,
  tempestLevel,
  tempestProgress,
} from "./charge";
export { CERISE_DRILL_TEXT } from "./controlText";
export { ceriseCutIn, showCutIn } from "./cutIn";
export { drawInfusion, infuseThrust, ROSE_EDGE, roseEdgeSwings } from "./infusion";
export { fall, land, runDrillDash, steer } from "./motion";
export { preparationShare } from "./preparation";
export { isCerise, usesCeriseDrill } from "./selection";

let followUp: "warp" | "guard" | null = null;

export function resetCeriseDrill(): void {
  cancelTempestHold();
  resetPreparation();
  resetMotion();
  resetInfusion();
  resetCutIn();
  followUp = null;
}

function readFollowUp(): boolean {
  if (hero.state !== "move") {
    if (!isFree()) followUp = null;
    return false;
  }
  if (hero.ground && take("guard") && !followUp) followUp = "guard";
  const warpPress = warpReady() && hero.mp >= warpCost() && take("dash");
  if (warpPress && !followUp) followUp = "warp";
  return warpPress;
}

export function readCeriseDrill(dir: number, dt: number): void {
  if (hero.state === "hurt") cancelTempestHold();
  if (readTempest()) return;
  const warpPress = readFollowUp();
  readPreparation();
  if (followUp && (blowsDone() || isFree())) {
    if (followUp === "warp") pressWarp();
    else if (hero.ground) pressEnhancedGuard(CHAIN.enhancedWindow);
    followUp = null;
  }
  readMotion(dir, dt, warpPress);
  if (!followUp) {
    readAttack();
    use("guard", pressGuard);
    holdGuard();
  }
}
