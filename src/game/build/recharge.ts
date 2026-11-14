import { buildStats } from "../../utils/build";
import { progress } from "../state";

/** seconds of recharge that pass in a step: Haste makes every ability, ultimate and warp recharge sooner */
export const rechargeStep = (dt: number): number => dt / buildStats(progress.build).cooldown;
