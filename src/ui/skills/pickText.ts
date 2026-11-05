import { KIND_LABEL, PACE_LABEL } from "../../constants/skillLabels";
import type { CharacterDef } from "../../types/character";
import type { SkillBranch, SkillNode } from "../../types/skill";
import { evolutionsOf, nodeById, rivalNames } from "../../utils/skillPicks";

/** the path a card comes from, with when it pays off */
export const branchLine = (branch: SkillBranch): string =>
  branch.pace ? `${branch.name}, ${PACE_LABEL[branch.pace].toLowerCase()}` : branch.name;

/** the kind of skill, and the rank this pick would reach */
export function rankLine(node: SkillNode, rank: number): string {
  if (node.ranks === 1) return KIND_LABEL[node.kind];
  return `${KIND_LABEL[node.kind]}, rank ${rank + 1} of ${node.ranks}`;
}

/** what learning a node for the first time locks out, or nothing */
export function lockNote(c: CharacterDef, node: SkillNode, rank: number): string {
  const rivals = rivalNames(c, node);
  return rivals.length && !rank ? `Locks out ${rivals.join(" and ")} for this run.` : "";
}

/** how a spell or its partner passive leads to an evolution not learned yet, one sentence for each */
export function recipeNotes(c: CharacterDef, node: SkillNode, ranks: Readonly<Record<string, number>>): string[] {
  return evolutionsOf(c, node)
    .filter((evolution) => !ranks[evolution.id] && evolution.evolves)
    .map((evolution) => {
      const spell = nodeById(c, evolution.evolves ?? "")?.name ?? "";
      if (node.id === evolution.evolves) {
        const partners = (evolution.mastered ?? []).map((id) => nodeById(c, id)?.name ?? "").join(" and ");
        return `With ${partners} at full rank, ${spell} evolves into ${evolution.name}.`;
      }
      return `${node.name} at full rank evolves ${spell} into ${evolution.name}.`;
    });
}
