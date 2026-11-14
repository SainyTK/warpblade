import { skillValues } from "../../../game/skills/query";
import { SKILL } from "../constants/skills/ids";
import { maxBreaths } from "./focus";
import { saya } from "./state";

/** Calm Mind: she is calm with Focus full (or one breath short with its sixth level), and for `hold` s after */
export function calmActive(): boolean {
  const v = skillValues(SKILL.calm);
  if (!v.bonus) return false;
  return saya.breaths >= maxBreaths() - (v.need ?? 0) || saya.calmLeft > 0;
}

/** the calm's own clock: full Focus keeps it topped up, and it runs down once Focus drops */
export function tickCalm(dt: number): void {
  const v = skillValues(SKILL.calm);
  if (!v.bonus) return;
  if (saya.breaths >= maxBreaths() - (v.need ?? 0)) saya.calmLeft = v.hold ?? 0;
  else saya.calmLeft = Math.max(0, saya.calmLeft - dt);
}

/** extra damage on her hits while calm */
export const calmBonus = (): number => (calmActive() ? (skillValues(SKILL.calm).bonus ?? 0) : 0);

/** extra damage on releases while calm */
export const calmRelease = (): number => (calmActive() ? (skillValues(SKILL.calm).release ?? 0) : 0);

/** the factor on what her guard lets through while calm */
export const calmChip = (): number => (calmActive() ? (skillValues(SKILL.calm).chip ?? 1) : 1);
