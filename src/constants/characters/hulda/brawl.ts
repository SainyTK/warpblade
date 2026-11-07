import { ULT_CHARGE } from "../kael";
import type { LegacyNode } from "../legacySkills";

/** Brawl: the fists themselves, longer strings and her quake. Pays off early. */
export const BRAWL: readonly LegacyNode[] = [
  {
    id: "b_hands",
    name: "Heavy Hands",
    kind: "passive",
    text: "Attack damage +8% per rank.",
    ranks: 3,
    scale: { ad: 0.08 },
  },
  {
    id: "b_uppercut",
    name: "Uppercut",
    kind: "combo",
    text: "J after the haymaker throws a fifth blow: a rising uppercut that launches the foe.",
    ranks: 1,
    perk: "uppercut",
  },
  {
    id: "b_knuckles",
    name: "Knuckle Rush",
    kind: "combo",
    text: "Hold J as the haymaker ends to throw six fast punches.",
    ranks: 1,
    perk: "knuckleRush",
  },
  {
    id: "b_titan",
    name: "Titan Throw",
    kind: "ultimate",
    text: `Tethers drag every minion in reach into a heap in your arms; spin once and hurl the heap. It strikes every foe in its path and bursts where it lands. Grows with attack damage. ${ULT_CHARGE}`,
    ranks: 1,
    ultimate: "titanThrow",
  },
];
