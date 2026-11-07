import type { SkillBranch } from "../../../types/skill";

/** Iron: the body, the Bull Rush and her plates. Steady. */
export const IRON: SkillBranch = {
  id: "iron",
  name: "Iron",
  pace: "steady",
  nodes: [
    {
      id: "i_hide",
      name: "Thick Hide",
      kind: "passive",
      text: "Max HP +12 per rank.",
      level: 1,
      ranks: 3,
      requires: [],
      stats: { hp: 12 },
    },
    {
      id: "i_horns",
      name: "Bull Horns",
      kind: "movement",
      text: "The Bull Rush lifts the first foe it hits onto your shoulder and slams it down at the end.",
      level: 6,
      ranks: 1,
      requires: ["i_hide"],
      perk: "bullHorns",
    },
    {
      id: "i_plates",
      name: "Iron Plates",
      kind: "enhance",
      text: "A plate cuts a blow to 40% instead of half.",
      level: 8,
      ranks: 1,
      requires: ["i_hide"],
      perk: "ironPlates",
    },
    {
      id: "i_wind",
      name: "Second Wind",
      kind: "passive",
      text: "Each plate that breaks heals 3% of max HP.",
      level: 11,
      ranks: 1,
      requires: ["i_plates"],
      perk: "secondWind",
    },
  ],
};
