import type { SkillBranch } from "../../../types/skill";
import { ULT_CHARGE } from "../kael";

/** Brawl: the fists themselves, longer strings and her quake. Pays off early. */
export const BRAWL: SkillBranch = {
  id: "brawl",
  name: "Brawl",
  pace: "early",
  nodes: [
    {
      id: "b_hands",
      name: "Heavy Hands",
      kind: "passive",
      text: "Attack damage +8% per rank.",
      level: 1,
      ranks: 3,
      requires: [],
      scale: { ad: 0.08 },
    },
    {
      id: "b_uppercut",
      name: "Uppercut",
      kind: "combo",
      text: "J after the haymaker throws a fifth blow: a rising uppercut that launches the foe.",
      level: 4,
      ranks: 1,
      requires: ["b_hands"],
      perk: "uppercut",
    },
    {
      id: "b_quake",
      name: "Quake Drop",
      kind: "ultimate",
      text: `Hop and slam both fists into the floor. A crack runs out and strikes every foe on the floor in reach, throwing minions up. The weakest ultimate; a stronger one replaces it. ${ULT_CHARGE}`,
      level: 6,
      ranks: 1,
      requires: [],
      ultimate: "quakeDrop",
    },
    {
      id: "b_knuckles",
      name: "Knuckle Rush",
      kind: "combo",
      text: "Hold J as the haymaker ends to throw six fast punches.",
      level: 11,
      ranks: 1,
      requires: ["b_uppercut"],
      perk: "knuckleRush",
    },
    {
      id: "b_titan",
      name: "Titan Throw",
      kind: "ultimate",
      text: `Tethers drag every minion in reach into a heap in your arms; spin once and hurl the heap. It strikes every foe in its path and bursts where it lands. Grows with attack damage. ${ULT_CHARGE}`,
      level: 18,
      ranks: 1,
      requires: ["b_quake"],
      group: "ultimate",
      ultimate: "titanThrow",
    },
  ],
};
