import type { SkillDef } from "../../../../types/skill";

/** Shield-Sister. Design: docs/skills/hulda.md. Values: chance; cooldown: least seconds between calls; power: attack damage a pass deals each foe; length: pixels of a charge; back: 1 charges back again; stun: seconds her bash stuns (0 none); stay: seconds she stays, charging each second (0 one charge); count: sisters a call; wall: 1 the evolved sisters charge in from both sides; every: seconds between them */
export const SHIELD_SISTER: SkillDef = {
  id: "h_shieldSister",
  name: "Shield-Sister",
  kind: "summon",
  risk: "easy",
  button: "auto",
  text: "A landed blow may call a spectral shield-sister who charges through foes.",
  levels: [
    {
      text: "A blow may call a shield-sister.",
      values: { chance: 0.15, cooldown: 2.5, power: 0.5, length: 80, back: 0, stun: 0, stay: 0, count: 1, wall: 0 },
    },
    {
      text: "More often, harder.",
      values: { chance: 0.2, cooldown: 2.5, power: 0.6, length: 80, back: 0, stun: 0, stay: 0, count: 1, wall: 0 },
    },
    {
      text: "She charges back again.",
      values: { chance: 0.2, cooldown: 2.5, power: 0.6, length: 80, back: 1, stun: 0, stay: 0, count: 1, wall: 0 },
    },
    {
      text: "More often.",
      values: { chance: 0.25, cooldown: 1.8, power: 0.6, length: 80, back: 1, stun: 0, stay: 0, count: 1, wall: 0 },
    },
    {
      text: "Her bash stuns.",
      values: { chance: 0.25, cooldown: 1.8, power: 0.6, length: 80, back: 1, stun: 0.6, stay: 0, count: 1, wall: 0 },
    },
    {
      text: "She stays and keeps charging.",
      values: { chance: 0.25, cooldown: 1.8, power: 0.6, length: 80, back: 1, stun: 0.6, stay: 4, count: 1, wall: 0 },
    },
    {
      text: "Two sisters.",
      values: { chance: 0.25, cooldown: 1.8, power: 0.6, length: 80, back: 1, stun: 0.6, stay: 4, count: 2, wall: 0 },
    },
    {
      text: "Longer charges, more often.",
      values: { chance: 0.3, cooldown: 1.8, power: 0.8, length: 120, back: 1, stun: 0.6, stay: 4, count: 2, wall: 0 },
    },
  ],
  evolution: {
    partner: "h_stampede",
    name: "Shieldwall",
    text: "Four sisters stay for good, charging across the floor from both sides every half second.",
    row: {
      text: "Four sisters charge from both sides.",
      values: {
        chance: 0.3,
        cooldown: 1.8,
        power: 0.8,
        length: 120,
        back: 1,
        stun: 0.6,
        stay: 1,
        count: 4,
        wall: 1,
        every: 0.5,
      },
    },
  },
};
