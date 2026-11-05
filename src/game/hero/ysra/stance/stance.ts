import { BACKSTEP, UNBROKEN, VAULT } from "../../../../constants/ysra/stance";
import { pressAge, take } from "../../../input";
import { hasPerk } from "../../../progress";
import { hero, progress } from "../../../state";
import { setState } from "../../actions";
import { startMove } from "../../combo";
import type { YsraPart } from "../part";
import { backstepGuarded, runBackstep, startBackstep } from "./backstep";
import { braceTakes, runBrace, startBrace } from "./brace";
import { canCut } from "./cut";
import { runDive, startDive } from "./dive";
import { resetStance, stance } from "./memory";
import { airVault, runVault, startVault, vaultFlying, vaultGuarded } from "./vault";
import { startCharge, tickWarpath } from "./warpath";

export { pressJump } from "./jump";

/** K: the pole vault on the floor; in the air, Skyline's second vault out of a vault, otherwise the dive */
export function pressVault(): boolean {
  const h = hero;
  if (vaultFlying()) {
    if (hasPerk("skyline") && stance.airVaults === 0) airVault();
    else return startDive();
    return true;
  }
  if (!canCut()) return false;
  return h.ground ? startVault() : startDive();
}

/** where she faced before a turn the held side made a moment ago, otherwise where she faces */
const settledFace = (): number => (stance.turned < BACKSTEP.turnGrace ? stance.faceBefore : hero.face);

/** L: a backstep with a side held away from where she faces, otherwise the brace. Both on the floor only. */
export function pressGuard(dir: number): boolean {
  if (!canCut() || !hero.ground) return false;
  const face = settledFace();
  if (dir && dir === -face) {
    hero.face = face;
    return startBackstep();
  }
  startBrace();
  return true;
}

/** her turns, so a side held a moment before L still reads as held away */
function watchFacing(dt: number): void {
  stance.turned += dt;
  if (hero.face === stance.face) return;
  stance.faceBefore = stance.face;
  stance.face = hero.face;
  stance.turned = 0;
}

/** a double tap toward a side: the Warpath charge */
export function doubleTapStance(dir: number): void {
  startCharge(dir);
}

/** a parry opened a counter: the next J is the counter thrust */
export const counterReady = (): boolean => stance.counter > 0;
export function spendCounter(): void {
  stance.counter = 0;
}

/**
 * J in a vault's flight: with Skyline, while she still rises the vault lets go so the glaive's air sweep takes the press;
 * otherwise Vault Strike turns it into the crash.
 */
function vaultStrike(): void {
  if (!vaultFlying() || pressAge("attack") < 0) return;
  if (hasPerk("skyline") && hero.vy < 0) {
    setState("fall");
    return;
  }
  if (!hasPerk("vaultStrike")) return;
  take("attack");
  stance.landed = false;
  startMove("vaultCrash");
}

export const STANCE_PART: YsraPart = {
  tick: (dt) => {
    watchFacing(dt);
    stance.counter = Math.max(0, stance.counter - dt);
    stance.shield = Math.max(0, stance.shield - dt);
    if (hero.ground) {
      stance.airVaults = 0;
      stance.dived = false;
    }
    vaultStrike();
    tickWarpath(dt);
  },
  runState: (dt) => {
    switch (hero.state) {
      case "vault":
        runVault();
        return true;
      case "dive":
        runDive();
        return true;
      case "brace":
        runBrace(dt);
        return true;
      case "backstep":
        runBackstep();
        return true;
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
  // Unbroken's Heat side belongs to the pyre part
  hurtScale: () => (hasPerk("unbroken") && hero.hp < progress.stats.hp * UNBROKEN.below ? UNBROKEN.scale : 1),
  absorbHurt: (_dmg, fromX) => vaultGuarded() || backstepGuarded() || braceTakes(fromX),
  reset: resetStance,
};
