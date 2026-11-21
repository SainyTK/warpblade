import { glow, place } from "../../../../engine/frame";
import { fineRing } from "../../../../game/effects/fine";
import { deny } from "../../../../game/hero/deny";
import { cutForSharedAction, maySharedAct } from "../../../../game/hero/sharedCut";
import { canAffordUlt, releaseUltimate, ultimateValues } from "../../../../game/hero/ultimate";
import { game, hero } from "../../../../game/state";
import { CHARGE_START, SKILL_TIERS } from "../../../../kaelDrill/skillTiers";
import { sfx } from "../../../../services/audio";
import { ROSE_RAMP } from "../../look/rose";
import { usesCeriseDrill } from "./selection";

let heldSince: number | null = null;
let released: { level: number; expires: number } | null = null;
let previousLevel = 0;

export const tempestHold = (): number =>
  heldSince === null ? 0 : (game.clock - heldSince) * (ultimateValues().charge ?? 1);

export function tempestLevel(): number {
  if (hero.ultCd > 0) return 0;
  const age = tempestHold();
  if (age < SKILL_TIERS[0].threshold) return 0;
  let level = 0;
  for (const tier of SKILL_TIERS) {
    if (age >= tier.threshold && canAffordUlt(tier.level)) level = tier.level;
  }
  return level;
}

export function tempestProgress(): number {
  const age = tempestHold();
  if (age < CHARGE_START || hero.ultCd > 0) return -1;
  const level = tempestLevel();
  const next = SKILL_TIERS[level];
  if (!next || !canAffordUlt(next.level)) return level;
  const from = SKILL_TIERS[level - 1]?.threshold ?? 0;
  return level + Math.min(1, (age - from) / (next.threshold - from));
}

export function startTempestHold(): void {
  heldSince = game.clock;
  released = null;
  previousLevel = 0;
}

export function releaseTempestHold(): void {
  const age = tempestHold();
  const level = tempestLevel();
  heldSince = null;
  previousLevel = 0;
  if (level > 0) released = { level, expires: game.clock + 0.2 };
  else if (age >= SKILL_TIERS[0].threshold) deny(hero.ultCd > 0 ? "ult" : "mp");
}

export function cancelTempestHold(): void {
  heldSince = null;
  released = null;
  previousLevel = 0;
}

export function readTempest(): boolean {
  const level = tempestLevel();
  if (level > previousLevel) sfx.chargeStep(level);
  previousLevel = level;
  if (!released) return false;
  if (game.clock > released.expires) {
    released = null;
    return false;
  }
  if (!maySharedAct() && hero.state !== "guard") return false;
  let releaseLevel = released.level;
  released = null;
  if (hero.ultCd > 0) return false;
  while (releaseLevel > 0 && !canAffordUlt(releaseLevel)) releaseLevel--;
  if (!releaseLevel) {
    deny("mp");
    return false;
  }
  cutForSharedAction();
  releaseUltimate(releaseLevel);
  return true;
}

export function drawTempestCharge(): void {
  if (!usesCeriseDrill()) return;
  const charge = tempestProgress();
  if (charge < 0) return;
  place();
  for (let i = 0; i <= Math.min(SKILL_TIERS.length - 1, charge); i++) {
    const radius = 9 + i * 5 + Math.sin(game.t * 10 + i) * 0.8;
    fineRing(hero.x, hero.y, radius, radius * 0.27, ROSE_RAMP[i + 3], 0.65);
  }
  glow(hero.x, hero.y - 14, 15 + charge * 4, ROSE_RAMP[4], 0.2 + charge * 0.07);
}
