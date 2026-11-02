import type { CharacterDef } from "../types/character";
import type { NodeStatus, SkillNode } from "../types/skill";
import { allNodes } from "./stats";

interface TreeView {
  level: number;
  points: number;
  ranks: Readonly<Record<string, number>>;
}

/** a node another learned node in its group has locked out */
function excluded(c: CharacterDef, node: SkillNode, ranks: Readonly<Record<string, number>>): boolean {
  if (!node.group) return false;
  return allNodes(c).some((n) => n !== node && n.group === node.group && (ranks[n.id] ?? 0) > 0);
}

/** a node whose every possible parent on one side is locked out can never be reached */
function unreachable(c: CharacterDef, node: SkillNode, ranks: Readonly<Record<string, number>>, seen = 0): boolean {
  if (excluded(c, node, ranks)) return true;
  if (seen > 12) return false;
  const nodes = allNodes(c);
  const dead = (ids: readonly string[]) =>
    ids.length > 0 &&
    ids.every((id) => {
      const parent = nodes.find((n) => n.id === id);
      return !parent || unreachable(c, parent, ranks, seen + 1);
    });
  return dead(node.requires) || dead(node.crossRequires ?? []);
}

const anyLearned = (ids: readonly string[], ranks: Readonly<Record<string, number>>): boolean =>
  !ids.length || ids.some((id) => (ranks[id] ?? 0) > 0);

export function nodeStatus(c: CharacterDef, node: SkillNode, v: TreeView): NodeStatus {
  const rank = v.ranks[node.id] ?? 0;
  if (rank >= node.ranks) return "maxed";
  if (rank === 0 && unreachable(c, node, v.ranks)) return "excluded";
  if (rank === 0 && !(anyLearned(node.requires, v.ranks) && anyLearned(node.crossRequires ?? [], v.ranks)))
    return "needsPath";
  if (v.level < node.level) return "needsLevel";
  if (v.points < node.cost) return "needsPoints";
  return "learnable";
}

/** the names of the nodes that open this one: one group per side, any one name in a group will do */
export function requirementNames(c: CharacterDef, node: SkillNode): string[][] {
  const nodes = allNodes(c);
  const names = (ids: readonly string[]) => ids.map((id) => nodes.find((n) => n.id === id)?.name ?? id);
  return [node.requires, node.crossRequires ?? []].filter((ids) => ids.length).map(names);
}

/** names of the nodes this one would lock out */
export function rivalNames(c: CharacterDef, node: SkillNode): string[] {
  if (!node.group) return [];
  return allNodes(c)
    .filter((n) => n !== node && n.group === node.group)
    .map((n) => n.name);
}
