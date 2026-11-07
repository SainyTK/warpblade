import type { Perk, SkillDef, SkillKind, SkillLevel, UltimateId } from "../../types/skill";
import type { Stats } from "../../types/stats";
import { SKILL_MAX_LEVEL } from "../growth";

/**
 * Temporary, until each hero's 20 skills are designed (docs/skill-design.md): a node of the hero's old skill tree,
 * turned into a skill so the kits keep working. Levels repeat the node's ranks and then stay; kit code reads the rank
 * through `skillValues(id).rank`. The hero designers replace these lists wholesale.
 */
export interface LegacyNode {
  id: string;
  name: string;
  kind: "combo" | "movement" | "spell" | "enhance" | "passive" | "ultimate" | "fusion";
  text: string;
  ranks: number;
  /** added per rank */
  stats?: Partial<Stats>;
  /** multiplies the total per rank */
  scale?: Partial<Stats>;
  perk?: Perk;
  ultimate?: UltimateId;
  /** the old tree's evolution of this node, folded in; otherwise the next node is the placeholder partner */
  evolution?: { partner: string; name: string; text: string; perk: Perk };
}

const KIND: Readonly<Record<LegacyNode["kind"], SkillKind>> = {
  combo: "attack",
  movement: "movement",
  spell: "spell",
  enhance: "attack",
  passive: "passive",
  ultimate: "ultimate",
  fusion: "passive",
};

/** every stat of a partial stat block times a number */
function times(block: Partial<Stats> | undefined, n: number): Partial<Stats> | undefined {
  if (!block) return undefined;
  return Object.fromEntries(Object.entries(block).map(([k, v]) => [k, (v ?? 0) * n])) as Partial<Stats>;
}

/** the row of one level: the node's rank at that level, its stats that many times */
function row(node: LegacyNode, level: number): SkillLevel {
  const rank = Math.min(level, node.ranks);
  const text = level === 1 ? node.text : rank === level ? `Rank ${rank} of ${node.ranks}.` : "No change yet.";
  return { text, stats: times(node.stats, rank), scale: times(node.scale, rank), values: { rank } };
}

/** the old tree's nodes as skills, each paired with its folded evolution's partner or the next node */
export function legacySkills(nodes: readonly LegacyNode[]): SkillDef[] {
  return nodes.map((node, i) => {
    const levels = Array.from({ length: SKILL_MAX_LEVEL }, (_, l) => row(node, l + 1));
    const evo = node.evolution;
    return {
      id: node.id,
      name: node.name,
      kind: KIND[node.kind],
      risk: "easy",
      button: "auto",
      text: node.text,
      levels,
      evolution: {
        partner: evo?.partner ?? nodes[(i + 1) % nodes.length].id,
        name: evo?.name ?? `${node.name} Evolved`,
        text: evo?.text ?? "No change yet.",
        row: levels[SKILL_MAX_LEVEL - 1],
        perk: evo?.perk,
      },
      perk: node.perk,
      ultimate: node.ultimate,
    };
  });
}
