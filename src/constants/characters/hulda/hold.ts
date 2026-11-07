import type { SkillBranch } from "../../../types/skill";

/** Hold: Bellow and what she does with a foe in her hands. Pays off late. */
export const HOLD: SkillBranch = {
  id: "hold",
  name: "Hold",
  pace: "late",
  nodes: [
    {
      id: "t_bellow",
      name: "Bellow",
      kind: "spell",
      text: "Press I to roar for 20 MP. Foes near you are dragged in and hurt, and minions reel.",
      level: 1,
      ranks: 1,
      requires: [],
    },
    {
      id: "h_grip",
      name: "Iron Grip",
      kind: "enhance",
      text: "Hold a foe for 2.2 seconds instead of 1.4, and knees deal half again as much.",
      level: 3,
      ranks: 1,
      requires: [],
      perk: "ironGrip",
    },
    {
      id: "h_swing",
      name: "Giant Swing",
      kind: "combo",
      text: "Down and K while holding: swing the foe round you twice, striking every foe near you each turn, then let it fly.",
      level: 5,
      ranks: 1,
      requires: ["h_grip"],
      perk: "giantSwing",
    },
    {
      id: "h_wreck",
      name: "Wrecking Throw",
      kind: "enhance",
      text: "A thrown foe bursts when it lands, striking every foe near it.",
      level: 6,
      ranks: 1,
      requires: ["h_grip"],
      perk: "wreckingThrow",
    },
  ],
};
