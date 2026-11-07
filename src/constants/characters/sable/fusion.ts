import type { SkillBranch } from "../../../types/skill";

/** skills that join two of Sable's paths */
export const FUSION: SkillBranch = {
  id: "fusion",
  name: "Fusion",
  nodes: [
    {
      id: "x_bootBolt",
      name: "Boot and Bolt",
      kind: "fusion",
      text: "A kick that lands loads 2 bolts into the quiver.",
      level: 11,
      ranks: 1,
      requires: ["k_boot"],
      crossRequires: ["m_quiver"],
      perk: "kickReload",
    },
    {
      id: "x_tripwire",
      name: "Tripwire Volley",
      kind: "fusion",
      text: "A snare that bites looses a bolt at every foe near it.",
      level: 13,
      ranks: 1,
      requires: ["t_barbed"],
      crossRequires: ["m_pierce"],
      perk: "snareVolley",
    },
  ],
};
