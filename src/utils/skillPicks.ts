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

/** the special is not offered once any ultimate is learned, and no ultimate once a stronger one is */
function supersededUltimate(c: CharacterDef, node: SkillNode, ranks: PickView["ranks"]): boolean {
  const others = allNodes(c).filter((n) => n !== node && n.ultimate && learned(ranks, n.id));
  return node.ultimate === c.special ? others.length > 0 : others.some((n) => n.ultimate !== c.special);
}

/** every one of these nodes is at its full rank */
function allMastered(c: CharacterDef, ids: readonly string[], ranks: PickView["ranks"]): boolean {
  return ids.every((id) => {
    const node = nodeById(c, id);
    return !!node && (ranks[id] ?? 0) >= node.ranks;
  });
}

/** a node can be offered when its level and paths are reached, nothing locks it out, and it has a rank left */
export function isAvailable(c: CharacterDef, node: SkillNode, v: PickView): boolean {
  if ((v.ranks[node.id] ?? 0) >= node.ranks) return false;
  if (v.level < node.level) return false;
  if (!anyLearned(node.requires, v.ranks) || !anyLearned(node.crossRequires ?? [], v.ranks)) return false;
  if (!(node.needs ?? []).every((id) => learned(v.ranks, id))) return false;
  if (node.evolves && !learned(v.ranks, node.evolves)) return false;
  if (!allMastered(c, node.mastered ?? [], v.ranks)) return false;
  if (node.ultimate && supersededUltimate(c, node, v.ranks)) return false;
  return !excluded(c, node, v.ranks);
}

const isEvolution = (o: PickOption): boolean => o.type === "skill" && o.node.kind === "evolution";

/** `count` cards in a random order: different skills Kael can learn now, then boons when too few skills are left.
 *  When an evolution is ready, one of them always takes the first card and no other evolution is dealt with it. */
export function rollPicks(c: CharacterDef, v: PickView, rng: Rng, count: number, boons: readonly Boon[]): PickOption[] {
  const skills: PickOption[] = c.branches.flatMap((branch) =>
    branch.nodes.filter((node) => isAvailable(c, node, v)).map((node) => ({ type: "skill" as const, node, branch })),
  );
  const fill: PickOption[] = boons.map((boon) => ({ type: "boon", boon }));
  const evolutions = skills.filter(isEvolution);
  if (!evolutions.length) return [...rng.shuffle(skills).slice(0, count), ...rng.shuffle(fill)].slice(0, count);
  const first = rng.pick(evolutions);
  const rest = skills.filter((o) => !isEvolution(o));
  return [first, ...rng.shuffle(rest).slice(0, count - 1), ...rng.shuffle(fill)].slice(0, count);
}

/** the evolutions a node is part of, as their spell or their partner passive */
export function evolutionsOf(c: CharacterDef, node: SkillNode): SkillNode[] {
  return allNodes(c).filter((n) => n.evolves === node.id || n.mastered?.includes(node.id));
}

/** the node with this id */
export function nodeById(c: CharacterDef, id: string): SkillNode | undefined {
  return allNodes(c).find((n) => n.id === id);
}

/** names of the nodes this one would lock out */
export function rivalNames(c: CharacterDef, node: SkillNode): string[] {
  if (!node.group) return [];
  return allNodes(c)
    .filter((n) => n !== node && n.group === node.group)
    .map((n) => n.name);
}
