import { ULT_COOLDOWN, ULT_LEVELS, ULT_LOCK } from "../../constants/ultimate";
import { sfx } from "../../services/audio";
import { isHeld } from "../input";
import { emitSkillEvent } from "../skills/events";
import { skillLevel, skillValues } from "../skills/query";
import { character, hero, progress } from "../state";
import { castUltimate } from "../ultimates/castUltimate";
import { leaveHang, setState, settle } from "./actions";
import { deny } from "./deny";
import { cutForSharedAction, maySharedAct } from "./sharedCut";

/** whether the MP bar pays for an ultimate level, 1 to 4; level 4 needs it full */
export function canAffordUlt(level: number): boolean {
  const cost = ULT_LEVELS[level - 1].cost;
  return Number.isFinite(cost) ? hero.mp >= cost : hero.mp >= progress.stats.mp - 0.5;
}

/** the numbers of the hero's ultimate skill, which upgrades their one ultimate; empty until it is held */
export function ultimateValues(): Readonly<Record<string, number>> {
  const skill = character.skills.find((s) => s.kind === "ultimate" && skillLevel(s.id));
  return skill ? skillValues(skill.id) : {};
}

/** seconds before the ultimate can be charged again: the held ultimate skill's `cooldown`, or the shared wait */
const ultCooldown = (): number => ultimateValues().cooldown ?? ULT_COOLDOWN;

/** share of the ultimate's cooldown still to run, 0 when ready */
export const ultRecharge = (): number => hero.ultCd / hero.ultFull;

/** U pressed: start gathering power if the ultimate has recharged and the first level is paid for; a press while it
 *  recharges is refused with a tick. */
export function startCharge(): boolean {
  const h = hero;
  if (h.ultCd > 0) {
    deny("ult");
    return true;
  }
  if (!canAffordUlt(1)) return false;
  if (!maySharedAct() && h.state !== "hang" && h.state !== "guard") return false;
  if (h.state === "hang") leaveHang();
  cutForSharedAction();
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
  h.ultCd = ultCooldown();
  castUltimate(progress.ultimate, level);
  // the cast may set its own wait (an ultimate skill's cooldown); the display measures whichever it is
  h.ultFull = Math.max(h.ultCd, 0.01);
  emitSkillEvent({ type: "ultimate", level });
}

/** hold U to climb the levels the MP bar can pay for, release to strike */
export function runCharge(dt: number): void {
  const h = hero;
  if (!isHeld("ultimate")) return release();
  h.charge += dt * (ultimateValues().charge ?? 1);
  let level = 1;
  for (let i = 1; i < ULT_LEVELS.length; i++) if (h.charge >= ULT_LEVELS[i].at && canAffordUlt(i + 1)) level = i + 1;
  if (level > h.chargeLevel) sfx.chargeStep(level);
  h.chargeLevel = level;
}

export function runUltimate(): void {
  if (hero.st >= ULT_LOCK) settle();
}
