import type { SkillDef } from "../../../../types/skill";

/** Piercing Bolts: Bolts fly on through foes. Values: pierce: foes a bolt passes through; perFoe: damage added for each foe passed; range: pixels; closingAll: the closing bolt passes through every foe; stagger: seconds a passed foe staggers. Design: docs/skills/sable.md */
export const PIERCING_BOLTS: SkillDef = {
  id: "s_pierce",
  name: "Piercing Bolts",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Bolts fly on through foes.",
  levels: [
    { text: "Bolts pass through one foe.", values: { pierce: 1, perFoe: 0, range: 250, closingAll: 0, stagger: 0 } },
    { text: "Bolts pass through one more foe.", values: { pierce: 2, perFoe: 0, range: 250, closingAll: 0, stagger: 0 } },
    { text: "Each foe a bolt passes through makes it 12% stronger.", values: { pierce: 2, perFoe: 0.12, range: 250, closingAll: 0, stagger: 0 } },
    { text: "Bolts fly a third farther.", values: { pierce: 2, perFoe: 0.12, range: 340, closingAll: 0, stagger: 0 } },
    { text: "Bolts pass through two more foes.", values: { pierce: 4, perFoe: 0.12, range: 340, closingAll: 0, stagger: 0 } },
    { text: "The closing bolt passes through every foe.", values: { pierce: 4, perFoe: 0.12, range: 340, closingAll: 1, stagger: 0 } },
    { text: "Foes a bolt passes through stagger.", values: { pierce: 4, perFoe: 0.12, range: 340, closingAll: 1, stagger: 0.3 } },
    { text: "Each foe passed makes the bolt 18% stronger.", values: { pierce: 4, perFoe: 0.18, range: 340, closingAll: 1, stagger: 0.3 } },
  ],
  evolution: {
    partner: "s_longshot",
    name: "Railbolt",
    text: "Every bolt passes through every foe and crosses the whole stage at double speed, growing with each foe it passes.",
    row: { text: "Bolts cross the stage through every foe.", values: { pierce: 99, perFoe: 0.18, range: 640, closingAll: 1, stagger: 0.3, speed: 860, rail: 1 } },
  },
};
