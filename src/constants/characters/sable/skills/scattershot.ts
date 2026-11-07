import type { SkillDef } from "../../../../types/skill";

/** Scattershot: The string fans out into side bolts. Values: sides: side bolts beside the closing bolt; every: side bolts beside every other bolt; share: a side bolt's damage; bend: side bolts bend toward foes; pierce: foes a side bolt passes through; airSides: side bolts of an air shot, slanting down. Design: docs/skills/sable.md */
export const SCATTERSHOT: SkillDef = {
  id: "s_scatter",
  name: "Scattershot",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The string fans out into side bolts.",
  levels: [
    { text: "The closing bolt fans out with two side bolts.", values: { sides: 2, every: 0, share: 0.5, bend: 0, pierce: 0, airSides: 0 } },
    { text: "Side bolts hit harder.", values: { sides: 2, every: 0, share: 0.6, bend: 0, pierce: 0, airSides: 0 } },
    { text: "Every bolt fans out.", values: { sides: 2, every: 2, share: 0.6, bend: 0, pierce: 0, airSides: 0 } },
    { text: "The closing bolt fans out into five.", values: { sides: 4, every: 2, share: 0.6, bend: 0, pierce: 0, airSides: 0 } },
    { text: "Side bolts hit harder.", values: { sides: 4, every: 2, share: 0.7, bend: 0, pierce: 0, airSides: 0 } },
    { text: "Side bolts bend toward foes.", values: { sides: 4, every: 2, share: 0.7, bend: 1, pierce: 0, airSides: 0 } },
    { text: "Side bolts pass through a foe.", values: { sides: 4, every: 2, share: 0.7, bend: 1, pierce: 1, airSides: 0 } },
    { text: "Every bolt fans out into five, harder.", values: { sides: 4, every: 4, share: 0.85, bend: 1, pierce: 1, airSides: 0 } },
  ],
  evolution: {
    partner: "s_featherdraw",
    name: "Hailfall",
    text: "In the air every bolt bursts into a hail of seven slanting down; on the floor every bolt fans into five.",
    row: { text: "Air bolts burst into a hail.", values: { sides: 4, every: 4, share: 0.85, bend: 1, pierce: 1, airSides: 6 } },
  },
};
