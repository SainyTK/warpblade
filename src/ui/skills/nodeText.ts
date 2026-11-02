import { KIND_LABEL } from "../../constants/skillLabels";
import type { CharacterDef } from "../../types/character";
import type { NodeStatus, SkillNode } from "../../types/skill";
import { requirementNames, rivalNames } from "../../utils/skillTree";

const plural = (n: number, word: string): string => `${n} ${word}${n === 1 ? "" : "s"}`;

/** the line under a node's name: its kind or rank, and the level it opens at while that is still ahead */
export function nodeMeta(node: SkillNode, rank: number, status: NodeStatus, level: number): string {
  if (status === "excluded") return "Locked out";
  if (rank >= node.ranks) return node.ranks > 1 ? `${rank}/${node.ranks}` : "Learned";
  const base = node.ranks > 1 ? `${rank}/${node.ranks}` : KIND_LABEL[node.kind];
  return node.level > level ? `${base}, Lv ${node.level}` : base;
}

/** a full sentence on why the node can or cannot be learned now */
export function statusText(c: CharacterDef, node: SkillNode, rank: number, status: NodeStatus): string {
  const rivals = rivalNames(c, node);
  const lockNote = rivals.length && !rank ? ` Learning it locks out ${rivals.join(" and ")} for this run.` : "";
  switch (status) {
    case "maxed":
      return node.ranks > 1 ? `All ${node.ranks} ranks learned.` : "Learned.";
    case "learnable":
      return `Costs ${plural(node.cost, "point")}.${lockNote}`;
    case "excluded":
      return "Locked out by a choice you made on this path.";
    case "needsLevel":
      return `Opens at level ${node.level}.${lockNote}`;
    case "needsPath":
      return `Learn ${requirementNames(c, node)
        .map((group) => group.join(" or "))
        .join(", and ")} first.${lockNote}`;
    case "needsPoints":
      return `Needs ${plural(node.cost, "skill point")}.${lockNote}`;
  }
}
