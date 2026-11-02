import { KIND_LABEL, PACE_LABEL } from "../../constants/skillLabels";
import type { CharacterDef } from "../../types/character";
import type { SkillBranch, SkillNode } from "../../types/skill";
import { rivalNames } from "../../utils/skillPicks";

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
