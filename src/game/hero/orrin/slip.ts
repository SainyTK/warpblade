import { MOMENTUM } from "../../../constants/orrin/momentum";
import { SWING } from "../../../constants/orrin/hook";
import { sfx } from "../../../services/audio";
import { hero } from "../../state";
import { heroGuarded } from "../guard";
import { rewardPerfectDodge } from "../perfectDodge";
import { backlineSlip } from "./backline";
import { gainMomentum, loseMomentumToHurt } from "./momentum";
import { orrin } from "./memory";

/** a blow meets him just after he let go of a fast swing, or early in an Undertow Backline */
const inSlip = (): boolean =>
  (orrin.sinceRelease < SWING.slipWindow && orrin.releaseSpeed > SWING.slipSpeed) || backlineSlip();

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
