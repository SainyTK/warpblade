import type { SkillBranch } from "../../../types/skill";

/** Trapper: snares and the reload's rhythm. Pays off late. */
export const TRAPPER: SkillBranch = {
  id: "trapper",
  name: "Trapper",
  pace: "late",
  nodes: [
    {
      id: "t_snare",
      name: "Snare",
      kind: "spell",
      text: "Press I to set a snare at your feet for 20 MP. It bites the first foe to walk in and holds it. Two at a time.",
      level: 1,
      ranks: 1,
      requires: [],
    },
    {
      id: "t_rhythm",
      name: "Perfect Rhythm",
      kind: "enhance",
      text: "The perfect reload window is wider, and a perfect reload primes 3 more bolts per rank.",
      level: 4,
      ranks: 2,
      requires: [],
    },
    {
      id: "t_barbed",
      name: "Barbed Snare",
      kind: "spell",
      text: "Snares bite 60% harder and hold foes longer.",
      level: 6,
      ranks: 1,
      requires: ["t_snare"],
      perk: "barbedSnare",
    },
    {
      id: "t_twin",
      name: "Twin Snare",
      kind: "spell",
      text: "Three snares on the floor at once, and a snare is ready again twice as fast.",
      level: 11,
      ranks: 1,
      requires: ["t_snare"],
      perk: "twinSnare",
    },
    {
      id: "t_focus",
      name: "Hunter's Focus",
      kind: "passive",
      text: "A perfect reload gives back 25 stamina and 10 MP.",
      level: 13,
      ranks: 1,
      requires: ["t_rhythm"],
      perk: "huntersFocus",
    },
  ],
};
