import type { SkillDef } from "../../../../types/skill";

/** Knuckle Wave. Design: docs/skills/hulda.md. Values: power: attack damage multiple of a wave; reach: pixels it travels; blows: 1 the haymaker, 2 the hook too, 3 every blow; pierce: 1 passes through every foe; stagger: seconds; both: 1 runs both ways; ring: burst radius at its end */
export const KNUCKLE_WAVE: SkillDef = {
  id: "h_knuckleWave",
  name: "Knuckle Wave",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Your blows push a pressure wave ahead, past your short reach.",
  levels: [
    {
      text: "The haymaker pushes a wave ahead.",
      values: { power: 0.4, reach: 30, blows: 1, pierce: 0, stagger: 0, both: 0, ring: 0 },
    },
    { text: "Wave damage +50%.", values: { power: 0.6, reach: 30, blows: 1, pierce: 0, stagger: 0, both: 0, ring: 0 } },
    {
      text: "The hook sends a wave too.",
      values: { power: 0.6, reach: 30, blows: 2, pierce: 0, stagger: 0, both: 0, ring: 0 },
    },
    {
      text: "Waves pass through every foe.",
      values: { power: 0.6, reach: 30, blows: 2, pierce: 1, stagger: 0, both: 0, ring: 0 },
    },
    {
      text: "Waves reach further and hit harder.",
      values: { power: 0.8, reach: 50, blows: 2, pierce: 1, stagger: 0, both: 0, ring: 0 },
    },
    {
      text: "Every blow sends a wave.",
      values: { power: 0.8, reach: 50, blows: 3, pierce: 1, stagger: 0, both: 0, ring: 0 },
    },
    { text: "Waves stagger.", values: { power: 0.8, reach: 50, blows: 3, pierce: 1, stagger: 0.3, both: 0, ring: 0 } },
    {
      text: "Wave damage +60%, longer reach.",
      values: { power: 1.3, reach: 60, blows: 3, pierce: 1, stagger: 0.3, both: 0, ring: 0 },
    },
  ],
  evolution: {
    partner: "h_bruise",
    name: "Thunder Knuckles",
    text: "Every wave runs far both ways and bursts in a ring where it ends.",
    row: {
      text: "Waves run both ways and burst.",
      values: { power: 1.3, reach: 120, blows: 3, pierce: 1, stagger: 0.3, both: 1, ring: 30 },
    },
  },
};
