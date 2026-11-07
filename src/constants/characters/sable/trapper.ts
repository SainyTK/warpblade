import type { LegacyNode } from "../legacySkills";

/** Trapper: snares and the reload's rhythm. Pays off late. */
export const TRAPPER: readonly LegacyNode[] = [
  {
    id: "t_rhythm",
    name: "Perfect Rhythm",
    kind: "enhance",
    text: "The perfect reload window is wider, and a perfect reload primes 3 more bolts per rank.",
    ranks: 2,
  },
  {
    id: "t_barbed",
    name: "Barbed Snare",
    kind: "spell",
    text: "Snares bite 60% harder and hold foes longer.",
    ranks: 1,
    perk: "barbedSnare",
  },
  {
    id: "t_twin",
    name: "Twin Snare",
    kind: "spell",
    text: "Three snares on the floor at once, and a snare is ready again twice as fast.",
    ranks: 1,
    perk: "twinSnare",
  },
  {
    id: "t_focus",
    name: "Hunter's Focus",
    kind: "passive",
    text: "A perfect reload gives back 25 stamina and 10 MP.",
    ranks: 1,
    perk: "huntersFocus",
  },
];
