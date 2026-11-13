import type { SkillDef } from "../../../../types/skill";

/** Chain Haul. Design: docs/skills/hulda.md. Values (the shared warp's, read by its tune): strike: attack damage of the arrival blow before the distance bonus; path: attack damage to each foe the gauntlet passes; charges: warps in a row; recharge: seconds a spent warp takes to come back; cost: MP a warp costs; reel: pixels round the landing in which foes reel (0 none); drag: 1 drags them in toward her; ring: the arrival blow strikes every foe this far round her (evolution) */
export const CHAIN_HAUL: SkillDef = {
  id: "h_chainHaul",
  name: "Chain Haul",
  kind: "movement",
  risk: "timed",
  button: "J",
  text: "Your warp's chained gauntlet hits on the way out, and you haul in harder and more often.",
  levels: [
    {
      text: "The gauntlet strikes every foe it passes.",
      values: { strike: 1.8, path: 0.6, charges: 1, recharge: 2, cost: 10, reel: 0, drag: 0, ring: 0 },
    },
    {
      text: "A harder arrival.",
      values: { strike: 2.6, path: 0.6, charges: 1, recharge: 2, cost: 10, reel: 0, drag: 0, ring: 0 },
    },
    {
      text: "Two warps in a row.",
      values: { strike: 2.6, path: 0.6, charges: 2, recharge: 2, cost: 10, reel: 0, drag: 0, ring: 0 },
    },
    {
      text: "Your landing makes foes near reel.",
      values: { strike: 2.6, path: 0.6, charges: 2, recharge: 2, cost: 10, reel: 40, drag: 0, ring: 0 },
    },
    {
      text: "Harder chain, faster recharge.",
      values: { strike: 2.6, path: 1.2, charges: 2, recharge: 1.6, cost: 10, reel: 40, drag: 0, ring: 0 },
    },
    {
      text: "Foes near your landing are dragged in.",
      values: { strike: 2.6, path: 1.2, charges: 2, recharge: 1.6, cost: 10, reel: 40, drag: 1, ring: 0 },
    },
    {
      text: "Three warps in a row, for less MP.",
      values: { strike: 2.6, path: 1.2, charges: 3, recharge: 1.6, cost: 7, reel: 40, drag: 1, ring: 0 },
    },
    {
      text: "The chain and the arrival hit far harder.",
      values: { strike: 4.5, path: 3, charges: 3, recharge: 1.6, cost: 7, reel: 40, drag: 1, ring: 0 },
    },
  ],
  evolution: {
    partner: "h_bullHorns",
    name: "Wrecking Ball",
    text: "You arrive like a wrecking ball: the arrival blow strikes every foe round you, and the warp costs far less.",
    row: {
      text: "The arrival strikes all round you.",
      values: { strike: 6, path: 4, charges: 3, recharge: 1.6, cost: 5, reel: 60, drag: 1, ring: 48 },
    },
  },
};
