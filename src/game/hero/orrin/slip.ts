import { SWING } from "../../../constants/orrin/hook";
import { MOMENTUM } from "../../../constants/orrin/momentum";
import { sfx } from "../../../services/audio";
import { hero } from "../../state";
import { heroGuarded } from "../guard";
import { rewardPerfectDodge } from "../perfectDodge";
import { orrin } from "./memory";
import { gainMomentum, loseMomentumToHurt } from "./momentum";

/** a blow meets him just after he let go of a fast swing */
const inSlip = (): boolean => orrin.sinceRelease < SWING.slipWindow && orrin.releaseSpeed > SWING.slipSpeed;

/**
 * A blow is about to land: in the Slip's window it misses, with the shared perfect dodge reward and Momentum. Otherwise
 * it lands and knocks Momentum out of him, unless he cannot be hurt right now anyway.
 */
export function absorbBlow(): boolean {
  if (heroGuarded()) return false;
  if (inSlip()) {
    if (!hero.perfectUsed) {
      hero.perfectUsed = true;
      rewardPerfectDodge();
      gainMomentum(MOMENTUM.slip);
      sfx.perfect();
    }
    return true;
  }
  loseMomentumToHurt();
  return false;
}
