import type { SkillDef } from "../../../../types/skill";

/** Heavy Boot: Point-Blank, her parry, kicks like a ram, and her guard bashes back. Values: power: attack damage the kick deals to the nearest foe it reaches (other foes take Point-Blank's own); stun: seconds; wall: kicked foes bounce off the edge; bash: attack damage of the stock bash on a block (0 off); bodies: attack damage a kicked foe deals to foes behind; chip: share of the guard's chip that still gets through; wide: the kick's reach multiple; shock, radius: the shockwave's attack damage and pixels. Design: docs/skills/sable.md */
export const HEAVY_BOOT: SkillDef = {
  id: "s_heavyBoot",
  name: "Heavy Boot",
  kind: "attack",
  risk: "precise",
  button: "K",
  text: "Point-Blank, the parry's kick, hits like a ram, and the guard bashes back.",
  levels: [
    {
      text: "Point-Blank kicks far harder and stuns longer.",
      values: { power: 8, stun: 1, wall: 0, bash: 0, bodies: 0, chip: 1, wide: 1, shock: 0, radius: 0 },
    },
    {
      text: "Kicked foes bounce off the edge.",
      values: { power: 8, stun: 1, wall: 1, bash: 0, bodies: 0, chip: 1, wide: 1, shock: 0, radius: 0 },
    },
    {
      text: "A block bashes the foe back with the stock.",
      values: { power: 8, stun: 1, wall: 1, bash: 0.8, bodies: 0, chip: 1, wide: 1, shock: 0, radius: 0 },
    },
    {
      text: "Kicked foes knock down others, and the kick hits harder.",
      values: { power: 14, stun: 1, wall: 1, bash: 0.8, bodies: 1, chip: 1, wide: 1, shock: 0, radius: 0 },
    },
    {
      text: "Blocks let half as much through; the kick hits harder.",
      values: { power: 20, stun: 1, wall: 1, bash: 0.8, bodies: 1, chip: 0.5, wide: 1, shock: 0, radius: 0 },
    },
    {
      text: "A wider kick that hits harder.",
      values: { power: 26, stun: 1, wall: 1, bash: 0.8, bodies: 1, chip: 0.5, wide: 1.6, shock: 0, radius: 0 },
    },
    {
      text: "Point-Blank hits harder and lands with a shockwave.",
      values: { power: 32, stun: 1, wall: 1, bash: 0.8, bodies: 1, chip: 0.5, wide: 1.6, shock: 5, radius: 60 },
    },
    {
      text: "Point-Blank hits far harder, and so does the bash.",
      values: { power: 60, stun: 1, wall: 1, bash: 2, bodies: 1, chip: 0.5, wide: 1.6, shock: 5, radius: 60 },
    },
  ],
  evolution: {
    partner: "s_slideKick",
    name: "Thunder Heel",
    text: "Point-Blank rings a wide shockwave and hits harder still, and every block bashes hard.",
    row: {
      text: "Point-Blank rings a wide shockwave.",
      values: { power: 140, stun: 1, wall: 1, bash: 4, bodies: 1, chip: 0.5, wide: 1.6, shock: 15, radius: 100 },
    },
  },
};
