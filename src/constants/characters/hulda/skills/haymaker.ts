import type { SkillDef } from "../../../../types/skill";

/** Wrecking Haymaker. Design: docs/skills/hulda.md. Values: power: attack damage added to the haymaker; stun: seconds; crack: pixels the floor cracks ahead (0 none); crackPower; behind: 1 cracks behind too; launch: 1 throws minions up; knock: power of the knock-down beside the struck foe (0 none); spike: power of the second impact once driven into the floor (evolution) */
export const WRECKING_HAYMAKER: SkillDef = {
  id: "h_haymaker",
  name: "Wrecking Haymaker",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The haymaker, your string's last blow, becomes your big hit.",
  levels: [
    {
      text: "The haymaker hits harder.",
      values: { power: 1, stun: 0.8, crack: 0, crackPower: 0, behind: 0, launch: 0, knock: 0, spike: 0 },
    },
    {
      text: "The haymaker cracks the floor ahead.",
      values: { power: 1, stun: 0.8, crack: 24, crackPower: 0.6, behind: 0, launch: 0, knock: 0, spike: 0 },
    },
    {
      text: "Harder haymaker, longer stun.",
      values: { power: 2, stun: 1.2, crack: 24, crackPower: 0.6, behind: 0, launch: 0, knock: 0, spike: 0 },
    },
    {
      text: "The haymaker throws minions up.",
      values: { power: 2, stun: 1.2, crack: 24, crackPower: 0.6, behind: 0, launch: 1, knock: 0, spike: 0 },
    },
    {
      text: "Wider, harder crack.",
      values: { power: 4, stun: 1.2, crack: 48, crackPower: 1.2, behind: 0, launch: 1, knock: 0, spike: 0 },
    },
    {
      text: "The crack runs both ways.",
      values: { power: 4, stun: 1.2, crack: 48, crackPower: 1.2, behind: 1, launch: 1, knock: 0, spike: 0 },
    },
    {
      text: "The blow knocks down foes beside it.",
      values: { power: 4, stun: 1.2, crack: 48, crackPower: 1.2, behind: 1, launch: 1, knock: 1.2, spike: 0 },
    },
    {
      text: "The haymaker hits far harder.",
      values: { power: 10, stun: 1.2, crack: 48, crackPower: 3, behind: 1, launch: 1, knock: 2, spike: 0 },
    },
  ],
  evolution: {
    partner: "h_knuckleWave",
    name: "Meteor Haymaker",
    text: "The haymaker drives its foe into the floor for a second impact, and the crack becomes a quake that throws minions up.",
    row: {
      text: "Spike the foe for a second impact; the crack is a quake.",
      values: { power: 18, stun: 1.2, crack: 60, crackPower: 5, behind: 1, launch: 1, knock: 3, spike: 6 },
    },
  },
};
