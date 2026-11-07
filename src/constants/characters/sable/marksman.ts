import { ULT_CHARGE } from "../kael";
import type { LegacyNode } from "../legacySkills";

/** Marksman: the bolts themselves, how many and how far through. Pays off early. */
export const MARKSMAN: readonly LegacyNode[] = [
  {
    id: "m_draw",
    name: "Heavy Draw",
    kind: "passive",
    text: "Attack damage +8% per rank.",
    ranks: 3,
    scale: { ad: 0.08 },
  },
  {
    id: "m_pierce",
    name: "Piercing Bolts",
    kind: "enhance",
    text: "Bolts pass through one more foe per rank.",
    ranks: 2,
  },
  {
    id: "m_quiver",
    name: "Deep Quiver",
    kind: "enhance",
    text: "The quiver holds 3 more bolts per rank.",
    ranks: 2,
  },
  {
    id: "m_ricochet",
    name: "Ricochet",
    kind: "enhance",
    text: "Bolts bounce once off the floor and the stage edge, and fly on through a foe they kill.",
    ranks: 1,
    perk: "ricochet",
  },
  {
    id: "m_scatter",
    name: "Scattershot",
    kind: "enhance",
    text: "Every shot looses two more bolts in a fan, each at 55% damage, for one bolt from the quiver.",
    ranks: 1,
    perk: "scattershot",
  },
  {
    id: "m_ult",
    name: "Deadeye",
    kind: "ultimate",
    text: `One heavy bolt the length of the stage through every foe in the line. Level 3 looses one each way, level 4 also sends a bolt at every foe on the screen. Grows with attack damage. ${ULT_CHARGE}`,
    ranks: 1,
    ultimate: "deadeye",
  },
];
