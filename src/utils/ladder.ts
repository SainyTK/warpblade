import { LADDER_PICK } from "../constants/stageArc";
import type { LadderFoe } from "../types/campaign";
import type { EnemyType } from "../types/enemy";

export const ladderEntry = (ladder: readonly LadderFoe[], foe: EnemyType): LadderFoe | undefined =>
  ladder.find((entry) => entry.foe === foe);

export function ladderChoices(
  ladder: readonly LadderFoe[],
  level: number,
  fits: (foe: EnemyType) => boolean = () => true,
): { foe: EnemyType; weight: number }[] {
  const open = ladder.filter((entry) => entry.level <= level);
  const rungs = [...new Set(open.map((entry) => entry.level))].sort((a, b) => b - a);
  const recent = open.flatMap((entry) => {
    const weight = LADDER_PICK[rungs.indexOf(entry.level)] ?? 0;
    return weight > 0 && fits(entry.foe) ? [{ foe: entry.foe, weight }] : [];
  });
  if (recent.length) return recent;
  const fitting = ladder.filter((entry) => fits(entry.foe));
  const reached = fitting.filter((entry) => entry.level <= level).sort((a, b) => b.level - a.level);
  const newest = reached[0] ?? fitting[0];
  return newest ? [{ foe: newest.foe, weight: 1 }] : [];
}

export function pickLadderFoe(choices: readonly { foe: EnemyType; weight: number }[], roll: number): EnemyType {
  const total = choices.reduce((sum, c) => sum + c.weight, 0);
  let left = roll * total;
  for (const choice of choices) {
    left -= choice.weight;
    if (left < 0) return choice.foe;
  }
  return choices[choices.length - 1].foe;
}
