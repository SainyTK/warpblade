import type { SkillBranch } from "../../../types/skill";

/** a rite learned, its partner passive at full rank and level 6 offer the rite's evolved form as the first card of a pick */
export const EVOLUTION: SkillBranch = {
  id: "evolution",
  name: "Evolution",
  nodes: [
    {
      id: "e_pyre",
      name: "Pyre Colonnade",
      kind: "evolution",
      text: "Flame Pillar evolves. The pillar burns hotter, and two more pillars burst up on either side of it a moment later.",
      level: 6,
      ranks: 1,
      requires: [],
      evolves: "r_pillar",
      mastered: ["r_kindle"],
      perk: "pyreColonnade",
    },
  ],
};
