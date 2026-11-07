import type { LegacyNode } from "../legacySkills";

/** Hold: Bellow and what she does with a foe in her hands. Pays off late. */
export const HOLD: readonly LegacyNode[] = [
  {
    id: "h_grip",
    name: "Iron Grip",
    kind: "enhance",
    text: "Hold a foe for 2.2 seconds instead of 1.4, and knees deal half again as much.",
    ranks: 1,
    perk: "ironGrip",
  },
  {
    id: "h_swing",
    name: "Giant Swing",
    kind: "combo",
    text: "Down and K while holding: swing the foe round you twice, striking every foe near you each turn, then let it fly.",
    ranks: 1,
    perk: "giantSwing",
  },
  {
    id: "h_wreck",
    name: "Wrecking Throw",
    kind: "enhance",
    text: "A thrown foe bursts when it lands, striking every foe near it.",
    ranks: 1,
    perk: "wreckingThrow",
  },
];
