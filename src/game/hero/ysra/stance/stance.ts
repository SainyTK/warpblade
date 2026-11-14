import { hero } from "../../../state";
import type { YsraPart } from "../part";
import { backstepFromGuard, backstepGuarded, runBackstep, watchFacing } from "./backstep";
import { canCut } from "./cut";
import { resetStance, stance } from "./memory";
import { chargeTakes, tickWarpath } from "./warpath";

export { YSRA_GUARD } from "./guardStyle";
export { pressJump } from "./jump";
export { chargeNow } from "./warpath";

/** the shared actions (warp, guard, dodge, abilities, ultimate) may cut in: free, a glaive blow out, or a backstep
 *  skidding to a stop */
export const stanceMayAct = (): boolean => canCut() || (hero.state === "backstep" && stance.landed);

/** a parry opened a counter: the next J is the counter thrust */
export const counterReady = (): boolean => stance.counter > 0;
export function spendCounter(): void {
  stance.counter = 0;
}

export const STANCE_PART: YsraPart = {
  tick: (dt) => {
    watchFacing(dt);
    stance.counter = Math.max(0, stance.counter - dt);
    tickWarpath(dt);
  },
  runState: () => {
    switch (hero.state) {
      case "backstep":
        runBackstep();
        return true;
      case "guard":
        return backstepFromGuard();
      default:
        return false;
    }
  },
  drivesMotion: () => hero.state === "backstep" && !stance.landed,
  absorbHurt: (_dmg, fromX) => backstepGuarded() || chargeTakes(fromX),
  reset: resetStance,
};
