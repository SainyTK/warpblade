import type { CharacterDef } from "../types/character";
import type { Boon, PickOption, SkillNode } from "../types/skill";
import type { Rng } from "./rng";
import { allNodes } from "./stats";

interface PickView {
  level: number;
  ranks: Readonly<Record<string, number>>;
}

const learned = (ranks: PickView["ranks"], id: string): boolean => (ranks[id] ?? 0) > 0;

/** empty means open from the start; otherwise any one of the ids will do */
const anyLearned = (ids: readonly string[], ranks: PickView["ranks"]): boolean =>
  !ids.length || ids.some((id) => learned(ranks, id));

/** another node of the same group was learned, which locks this one out for the run */
function excluded(c: CharacterDef, node: SkillNode, ranks: PickView["ranks"]): boolean {
  if (!node.group) return false;
  return allNodes(c).some((n) => n !== node && n.group === node.group && learned(ranks, n.id));
}

/** a node can be offered when its level and paths are reached, nothing locks it out, and it has a rank left */
export function isAvailable(c: CharacterDef, node: SkillNode, v: PickView): boolean {
  if ((v.ranks[node.id] ?? 0) >= node.ranks) return false;
  if (v.level < node.level) return false;
  if (!anyLearned(node.requires, v.ranks) || !anyLearned(node.crossRequires ?? [], v.ranks)) return false;
  return !excluded(c, node, v.ranks);
}

/** `count` cards in a random order: different skills Kael can learn now, then boons when too few skills are left */
export function rollPicks(c: CharacterDef, v: PickView, rng: Rng, count: number, boons: readonly Boon[]): PickOption[] {
  const skills: PickOption[] = c.branches.flatMap((branch) =>
    branch.nodes.filter((node) => isAvailable(c, node, v)).map((node) => ({ type: "skill" as const, node, branch })),
  );
  const fill: PickOption[] = boons.map((boon) => ({ type: "boon", boon }));
  return [...rng.shuffle(skills).slice(0, count), ...rng.shuffle(fill)].slice(0, count);
}

/** names of the nodes this one would lock out */
export function rivalNames(c: CharacterDef, node: SkillNode): string[] {
  if (!node.group) return [];
  return allNodes(c)
    .filter((n) => n !== node && n.group === node.group)
    .map((n) => n.name);
}
