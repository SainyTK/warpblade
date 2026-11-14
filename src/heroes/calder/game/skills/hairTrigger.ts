import { KEEN } from "../../../../constants/combo";
import { markFoe } from "../../../../game/enemies/skillStatus";
import { movePayoff, payoffLands } from "../../../../game/skills/payoff";
import { skillEvolved, skillValues, withCharms } from "../../../../game/skills/query";
import { game, hero, progress } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { muzzlePoint } from "../aim";
import { loadRounds } from "../chamber";
import { createSlug } from "../shots/slug";
import { calder } from "../state";

const SKILL = "ca_trigger";
/** the sword's angle as a breaching slug leaves the muzzle: level, at the foe */
const BREACH_ANGLE = 0;

/** what Hair Trigger adds to a Trigger's blast on the foe the blow paid off on: its power, a broken guard, a stagger */
export interface TriggerBonus {
  blast: number;
  heavy: boolean;
  stagger?: number;
}

/** seconds after a blow lands that J is a Trigger: Hair Trigger's window, or the shared Keen window */
export const triggerWindow = (): number => skillValues(SKILL).window ?? KEEN.window;

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

/**
 * After a Trigger's blast: Hair Trigger marks the foe it paid off on; Dead Center gives the round back, and every third
 * Trigger in a row sends a breaching slug through that foe alone.
 */
export function afterTrigger(foe: Enemy | null): void {
  const v = skillValues(SKILL);
  if (!foe || !v.bonus || !payoffLands(movePayoff(), foe)) return;
  if (v.mark) markFoe(foe, SKILL, withCharms("duration", v.markTime), v.mark);
  if (!skillEvolved(SKILL)) return;
  loadRounds(v.refund);
  if (calder.triggerStreak % v.breachEvery !== 0 || foe.hp <= 0) return;
  const [x, y] = muzzlePoint(hero.face > 0 ? BREACH_ANGLE : Math.PI - BREACH_ANGLE);
  game.fx.push(
    createSlug(x, y, hero.face, { damage: progress.stats.ad * v.breach, wide: true, only: foe, source: "attacks" }),
  );
}
