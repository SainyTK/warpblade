import type { LegacyNode } from "../legacySkills";

/** skills that join two of Sable's paths */
export const FUSION: readonly LegacyNode[] = [
  {
    id: "x_bootBolt",
    name: "Boot and Bolt",
    kind: "fusion",
    text: "A kick that lands loads 2 bolts into the quiver.",
    ranks: 1,
    perk: "kickReload",
  },
  {
    id: "x_tripwire",
    name: "Tripwire Volley",
    kind: "fusion",
    text: "A snare that bites looses a bolt at every foe near it.",
    ranks: 1,
    perk: "snareVolley",
  },
];
