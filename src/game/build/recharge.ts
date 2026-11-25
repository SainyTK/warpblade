import { currentBuildStats } from "./stats";

/** seconds of recharge that pass in a step: Haste makes every ability, ultimate and warp recharge sooner */
export const rechargeStep = (dt: number): number => dt / currentBuildStats().cooldown;
