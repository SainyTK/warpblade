import { movePayoff, payoffLands } from "../../../../game/skills/payoff";
import { skillValues } from "../../../../game/skills/query";
import type { Enemy } from "../../../../types/enemy";
import { calder } from "../state";

const SKILL = "ca_trigger";

/** what Hair Trigger adds to a Trigger's blast on the foe the blow paid off on: its power, a broken guard, a stagger */
export interface TriggerBonus {
  blast: number;
  heavy: boolean;
  stagger?: number;
}

/**
 * Hair Trigger's share of a Trigger: a precise payoff, so its bonus lands only on the foe the Trigger blow paid off on.
 * Triggers in a row add to it, up to a cap. Without the skill, the plain blast.
 */
export function triggerBonus(foe: Enemy | null): TriggerBonus {
  const v = skillValues(SKILL);
  if (!v.bonus || !foe || !payoffLands(movePayoff(), foe)) return { blast: 1, heavy: false };
  const streak = Math.min(v.streakCap ?? 0, (v.streak ?? 0) * Math.max(0, calder.triggerStreak - 1));
  return { blast: 1 + v.bonus + streak, heavy: !!v.guardBreak, stagger: v.stagger };
}
