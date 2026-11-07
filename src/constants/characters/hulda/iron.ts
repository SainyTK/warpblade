import type { LegacyNode } from "../legacySkills";

/** Iron: the body, the Bull Rush and her plates. Steady. */
export const IRON: readonly LegacyNode[] = [
  {
    id: "i_hide",
    name: "Thick Hide",
    kind: "passive",
    text: "Max HP +12 per rank.",
    ranks: 3,
    stats: { hp: 12 },
  },
  {
    id: "i_horns",
    name: "Bull Horns",
    kind: "movement",
    text: "The Bull Rush lifts the first foe it hits onto your shoulder and slams it down at the end.",
    ranks: 1,
    perk: "bullHorns",
  },
  {
    id: "i_plates",
    name: "Iron Plates",
    kind: "enhance",
    text: "A plate cuts a blow to 40% instead of half.",
    ranks: 1,
    perk: "ironPlates",
  },
  {
    id: "i_wind",
    name: "Second Wind",
    kind: "passive",
    text: "Each plate that breaks heals 3% of max HP.",
    ranks: 1,
    perk: "secondWind",
  },
];
