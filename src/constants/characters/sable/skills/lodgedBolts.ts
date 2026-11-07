import type { SkillDef } from "../../../../types/skill";

/** Lodged Bolts: Bolts stay in the foe and fester; a kick tears them out. Values: rate: attack damage a second per lodged bolt; max: bolts a foe carries; tear: attack damage per bolt a kick tears out; slow: lodged bolts slow from this many; closing: bolts a closing bolt lodges; flyOn: attack damage of torn bolts flying on at other foes; seek: torn bolts seek every foe around. Design: docs/skills/sable.md */
export const LODGED_BOLTS: SkillDef = {
  id: "s_lodged",
  name: "Lodged Bolts",
  kind: "dot",
  risk: "timed",
  button: "J",
  text: "Bolts stay in the foe and fester; a kick tears them out.",
  levels: [
    { text: "Bolts stay lodged and fester.", values: { rate: 0.1, max: 3, tear: 0, slow: 0, closing: 1, flyOn: 0, seek: 0 } },
    { text: "More bolts stay lodged.", values: { rate: 0.1, max: 5, tear: 0, slow: 0, closing: 1, flyOn: 0, seek: 0 } },
    { text: "A kick rips the bolts out.", values: { rate: 0.1, max: 5, tear: 0.5, slow: 0, closing: 1, flyOn: 0, seek: 0 } },
    { text: "Lodged bolts fester faster.", values: { rate: 0.2, max: 6, tear: 0.5, slow: 0, closing: 1, flyOn: 0, seek: 0 } },
    { text: "Lodged bolts slow the foe.", values: { rate: 0.2, max: 6, tear: 0.5, slow: 2, closing: 1, flyOn: 0, seek: 0 } },
    { text: "The closing bolt lodges two.", values: { rate: 0.2, max: 10, tear: 0.5, slow: 2, closing: 2, flyOn: 0, seek: 0 } },
    { text: "Torn-out bolts fly at other foes.", values: { rate: 0.4, max: 10, tear: 0.5, slow: 2, closing: 2, flyOn: 1, seek: 0 } },
    { text: "Lodged bolts fester much faster.", values: { rate: 0.9, max: 12, tear: 1.5, slow: 2, closing: 2, flyOn: 1, seek: 0 } },
  ],
  evolution: {
    partner: "s_heavyBoot",
    name: "Pincushion",
    text: "Up to twenty bolts lodge, and a kick tears them out as a burst of seeking bolts through every foe around.",
    row: { text: "A kick tears out a burst of seeking bolts.", values: { rate: 0.9, max: 20, tear: 1.5, slow: 2, closing: 2, flyOn: 2, seek: 1 } },
  },
};
