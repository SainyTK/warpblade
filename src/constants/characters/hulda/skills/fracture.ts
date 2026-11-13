import type { SkillDef } from "../../../../types/skill";

/** Crushing Grip. Design: docs/skills/hulda.md. Values: crush: attack damage a second to the held foe; hold: seconds a hold lasts; knee: attack damage of a knee; fracture: attack damage a stack deals each second (0 none); duration: seconds; spread: 1 thrown bodies and rings pass it on; max: most stacks; mark: share more a fractured foe takes from throws and slams; snap: times the remaining damage dealt at once by a throw on a full stack (evolution) */
export const CRUSHING_GRIP: SkillDef = {
  id: "h_fracture",
  name: "Crushing Grip",
  kind: "dot",
  risk: "timed",
  button: "J",
  text: "Foes in your hands are crushed, and leave fractured.",
  levels: [
    {
      text: "Held foes are crushed.",
      values: { crush: 0.3, hold: 1.8, knee: 0.5, fracture: 0, duration: 4, spread: 0, max: 1, mark: 0, snap: 0 },
    },
    {
      text: "Knees hit harder.",
      values: { crush: 0.3, hold: 1.8, knee: 0.75, fracture: 0, duration: 4, spread: 0, max: 1, mark: 0, snap: 0 },
    },
    {
      text: "Thrown foes stay fractured.",
      values: { crush: 0.3, hold: 1.8, knee: 0.75, fracture: 0.3, duration: 4, spread: 0, max: 1, mark: 0, snap: 0 },
    },
    {
      text: "Fractures spread to struck foes.",
      values: { crush: 0.3, hold: 1.8, knee: 0.75, fracture: 0.3, duration: 4, spread: 1, max: 1, mark: 0, snap: 0 },
    },
    {
      text: "Stronger crush, longer hold.",
      values: { crush: 0.6, hold: 2.2, knee: 0.75, fracture: 0.6, duration: 4, spread: 1, max: 1, mark: 0, snap: 0 },
    },
    {
      text: "Fractures stack.",
      values: { crush: 0.6, hold: 2.2, knee: 0.75, fracture: 0.6, duration: 4, spread: 1, max: 3, mark: 0, snap: 0 },
    },
    {
      text: "Fractured foes take more from throws.",
      values: { crush: 0.6, hold: 2.2, knee: 0.75, fracture: 0.6, duration: 4, spread: 1, max: 3, mark: 0.2, snap: 0 },
    },
    {
      text: "Fractures far stronger and longer.",
      values: { crush: 1.2, hold: 2.2, knee: 0.75, fracture: 2.5, duration: 8, spread: 1, max: 3, mark: 0.2, snap: 0 },
    },
  ],
  evolution: {
    partner: "h_wreckingThrow",
    name: "Bonebreaker",
    text: "A throw on a foe with full fractures snaps it: all their damage at once, three times over, and fractures for foes near.",
    row: {
      text: "Throws snap full fractures.",
      values: { crush: 1.2, hold: 2.2, knee: 0.75, fracture: 2.5, duration: 8, spread: 1, max: 3, mark: 0.2, snap: 3 },
    },
  },
};
