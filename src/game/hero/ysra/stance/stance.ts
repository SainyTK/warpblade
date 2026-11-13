import { VAULT } from "../../../../constants/ysra/stance";
import { rechargeStep } from "../../../build/recharge";
import { pressAge, take } from "../../../input";
import { skillValues } from "../../../skills/query";
import { hero } from "../../../state";
import { startMove } from "../../combo";
import type { YsraPart } from "../part";
import { backstepFromGuard, backstepGuarded, runBackstep, watchFacing } from "./backstep";
import { canCut, cutMove } from "./cut";
import { runDive, startDive } from "./dive";
import { resetStance, stance } from "./memory";
import { airVault, runVault, startVault, vaultFlying, vaultGuarded } from "./vault";
import { chargeTakes, tickWarpath } from "./warpath";

export { YSRA_GUARD } from "./guardStyle";
export { pressJump } from "./jump";
export { chargeNow } from "./warpath";

/** a vault or dive has come down and she is in its landing crouch, or a backstep is skidding to a stop */
const settling = (): boolean =>
  (hero.state === "vault" || hero.state === "dive" || hero.state === "backstep") && stance.landed;

/** the shared actions (warp, guard, dodge, ultimate) may cut in: free, a glaive blow out, a vault in flight, or the
 *  landing of a vault, a dive or a backstep */
export const stanceMayAct = (): boolean => canCut() || vaultFlying() || settling();

/** she may dive now: in the air with a dive left this airtime */
const diveLeft = (): boolean => !hero.ground && stance.dives < (skillValues("y_dive").dives ?? 1);

/** seconds before the vault ability can be cast: none in the air while a dive is left, else the vault's recharge */
export const vaultWait = (): number => (diveLeft() || vaultFlying() ? 0 : stance.vaultCd);
/** the length of the vault's last recharge, for its tab */
export const vaultFull = (): number => Math.max(0.01, stance.vaultFull);

/**
 * I on the vault: on the floor the pole vault toward a held side (held, the high vault), also out of the guard or a
 * backstep's skid; in a vault's flight Vault Strike's air vault once, otherwise the dive; in the air the dive. I in a
 * backstep's hop vaults the moment she lands.
 */
export function castVault(high: boolean): boolean {
  const h = hero;
  if (vaultFlying()) {
    if (!skillValues("y_vault").airVault || stance.airVaults > 0) return startDive();
    airVault();
    return true;
  }
  if (h.state === "backstep" && !stance.landed) {
    stance.vaultNext = true;
    return true;
  }
  if (!stanceMayAct() && h.state !== "guard") return false;
  if (!h.ground) return startDive();
  if (stance.vaultCd > 0) return false;
  cutMove();
  startVault(high);
  return true;
}

/** Heaven's Hook: the vault comes back at once */
export function rechargeVault(): void {
  stance.vaultCd = 0;
}

/** a parry opened a counter: the next J is the counter thrust */
export const counterReady = (): boolean => stance.counter > 0;
export function spendCounter(): void {
  stance.counter = 0;
}

/** J in a vault's flight is the crash, at any point of the flight */
function vaultStrike(): void {
  if (!vaultFlying() || pressAge("attack") < 0) return;
  take("attack");
  stance.landed = false;
  startMove("vaultCrash");
}

export const STANCE_PART: YsraPart = {
  tick: (dt) => {
    watchFacing(dt);
    stance.counter = Math.max(0, stance.counter - dt);
    stance.vaultCd = Math.max(0, stance.vaultCd - rechargeStep(dt));
    if (hero.ground) {
      stance.airVaults = 0;
      stance.dives = 0;
    }
    vaultStrike();
    tickWarpath(dt);
  },
  runState: () => {
    switch (hero.state) {
      case "vault":
        runVault();
        return true;
      case "dive":
        runDive();
        return true;
      case "backstep":
        runBackstep();
        return true;
      case "guard":
        return backstepFromGuard();
      default:
        return false;
    }
  },
  drivesMotion: () => {
    const st = hero.state;
    return st === "vault" || st === "dive" || (st === "backstep" && !stance.landed);
  },
  gravity: () => {
    if (hero.state === "dive") return 0;
    if (vaultFlying()) return VAULT.gravity;
    return null;
  },
  absorbHurt: (_dmg, fromX) => vaultGuarded() || backstepGuarded() || chargeTakes(fromX),
  reset: resetStance,
};
