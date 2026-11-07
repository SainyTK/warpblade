import { buildStats, type CharmedStat, charmed } from "../../utils/build";
import { skillOf, skillRow } from "../../utils/skills";
import { character, progress } from "../state";

/** the hero in play's level of a skill: 1 to 8, or 0 when not held */
export const skillLevel = (id: string): number => progress.build.skills[id] ?? 0;

/** the hero in play holds this skill in its evolved form */
export const skillEvolved = (id: string): boolean => progress.build.evolved.includes(id);

const NONE: Readonly<Record<string, number>> = {};

/** the numbers of a held skill's current row (its evolution's once evolved); empty when not held */
export function skillValues(id: string): Readonly<Record<string, number>> {
  const level = skillLevel(id);
  const def = level ? skillOf(character, id) : undefined;
  if (!def) return NONE;
  return skillRow(def, level, skillEvolved(id)).values ?? NONE;
}

/** a skill's number with the hero in play's charms applied: Multitude adds to `amount`; Reach, Persistence,
 *  Swiftness and Haste multiply `area`, `duration`, `speed` and `cooldown` */
export const withCharms = (stat: CharmedStat, value: number): number =>
  charmed(stat, value, buildStats(progress.build));
