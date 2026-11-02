import { ULT_LEVELS, ULT_LOCK } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import { isHeld } from "../input";
import { hero, progress } from "../state";
import { castUltimate } from "../ultimates/castUltimate";
import { isFree, leaveHang, setState, settle } from "./actions";
import { endCombo } from "./combo";

/** whether the MP bar pays for an ultimate level, 1 to 4; level 4 needs it full */
export function canAffordUlt(level: number): boolean {
  const cost = ULT_LEVELS[level - 1].cost;
  return Number.isFinite(cost) ? hero.mp >= cost : hero.mp >= progress.stats.mp - 0.5;
}

/** U pressed: start gathering power if the first level is paid for */
export function startCharge(): boolean {
  const h = hero;
  if (!canAffordUlt(1)) return false;
  if (!isFree() && h.state !== "hang" && h.state !== "move") return false;
  if (h.state === "hang") leaveHang();
  h.move = null;
  endCombo(false);
  h.charge = 0;
  h.chargeLevel = 1;
  setState("charge");
  sfx.chargeStep(1);
  return true;
}

function release(): void {
  const h = hero;
  const level = h.chargeLevel;
  const cost = ULT_LEVELS[level - 1].cost;
  h.mp = Number.isFinite(cost) ? h.mp - cost : 0;
  setState("ultimate");
  h.inv = Math.max(h.inv, ULT_LOCK);
  h.charge = 0;
  h.chargeLevel = 0;
  castUltimate(progress.ultimate, level);
}

/** hold U to climb the levels the MP bar can pay for, release to strike */
export function runCharge(dt: number): void {
  const h = hero;
  if (!isHeld("ultimate")) return release();
  h.charge += dt;
  let level = 1;
  for (let i = 1; i < ULT_LEVELS.length; i++) if (h.charge >= ULT_LEVELS[i].at && canAffordUlt(i + 1)) level = i + 1;
  if (level > h.chargeLevel) sfx.chargeStep(level);
  h.chargeLevel = level;
}

export function runUltimate(): void {
  if (hero.st >= ULT_LOCK) settle();
}
