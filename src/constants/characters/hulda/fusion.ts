import type { LegacyNode } from "../legacySkills";

/** skills that join two of Hulda's paths */
export const FUSION: readonly LegacyNode[] = [
  {
    id: "x_rushGrab",
    name: "Rush Grab",
    kind: "fusion",
    text: "A Bull Rush that hits a minion takes it into your hands.",
    ranks: 1,
    perk: "rushGrab",
  },
  {
    id: "x_aftershock",
    name: "Aftershock Suplex",
    kind: "fusion",
    text: "The suplex and Skyfall Grab rings are 50% wider and throw minions up.",
    ranks: 1,
    perk: "aftershockSuplex",
  },
];
