import type { SkillDef } from "../../../../types/skill";

/** Rift Bell. Design: docs/skills/orrin.md. Values: chance: chance a tip hit drops one; cooldown: seconds between bells; power: attack damage a swing; swings: swings a bell makes; stun: 1 the first swing stuns; wide: 1 a swing also hits the foes beside; toll: ability power of the toll ring; count: bells at once; great: 1 the bell is twice the size and its toll stuns everything on screen (evolution) */
export const RIFT_BELL: SkillDef = {
  id: "o_bell",
  name: "Rift Bell",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "A tip hit may drop a bronze bell from a rift that swings through the foe.",
  levels: [
    { text: "12% on a tip hit: a bell swings 0.8x twice.", values: { chance: 0.12, cooldown: 2, power: 0.8, swings: 2, stun: 0, wide: 0, toll: 0, count: 1, great: 0 } },
    { text: "The first swing stuns.", values: { chance: 0.12, cooldown: 2, power: 0.8, swings: 2, stun: 1, wide: 0, toll: 0, count: 1, great: 0 } },
    { text: "Swings hit the foes beside it too.", values: { chance: 0.12, cooldown: 2, power: 0.8, swings: 2, stun: 1, wide: 1, toll: 0, count: 1, great: 0 } },
    { text: "The bell tolls a ring for 0.4x.", values: { chance: 0.12, cooldown: 2, power: 0.8, swings: 2, stun: 1, wide: 1, toll: 0.4, count: 1, great: 0 } },
    { text: "Swings deal 1.2x.", values: { chance: 0.12, cooldown: 2, power: 1.2, swings: 2, stun: 1, wide: 1, toll: 0.4, count: 1, great: 0 } },
    { text: "Two bells at once.", values: { chance: 0.12, cooldown: 2, power: 1.2, swings: 2, stun: 1, wide: 1, toll: 0.4, count: 2, great: 0 } },
    { text: "Bells swing 3 times.", values: { chance: 0.12, cooldown: 2, power: 1.2, swings: 3, stun: 1, wide: 1, toll: 0.4, count: 2, great: 0 } },
    { text: "Swings deal 1.8x.", values: { chance: 0.12, cooldown: 2, power: 1.8, swings: 3, stun: 1, wide: 1, toll: 0.4, count: 2, great: 0 } },
  ],
  evolution: {
    partner: "o_tether",
    name: "Great Bell",
    text: "The bell is twice the size, and its toll stuns everything on screen for 0.5 s.",
    row: { text: "A great bell; its toll stuns the screen.", values: { chance: 0.12, cooldown: 2, power: 1.8, swings: 3, stun: 1, wide: 1, toll: 0.8, count: 2, great: 1 } },
  },
};
