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
  const open = ladder.filter((entry) => entry.level <= level && fits(entry.foe));
  const pool = open.length ? open : ladder.filter((entry) => fits(entry.foe)).slice(0, 1);
  const rungs = [...new Set(pool.map((entry) => entry.level))].sort((a, b) => b - a);
  return pool.flatMap((entry) => {
    const weight = LADDER_PICK[rungs.indexOf(entry.level)] ?? 0;
    return weight > 0 ? [{ foe: entry.foe, weight }] : [];
  });
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
