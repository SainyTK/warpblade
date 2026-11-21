import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { bonus: 0.15 },
  { bonus: 0.3 },
  { crescent: 0.35 },
  { reach: 1.2 },
  { bonus: 0.35, crescent: 0.4 },
  { pull: 1 },
  { pierce: 1 },
  { bonus: 0.45, crescent: 0.5 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The sweep turn deals +40%.", drill: { first: 0.4 } },
  { text: "Sweep turn +40% to +70%.", drill: { first: 0.7 } },
  { text: "New: the sweep turn throws a sand crescent out each side.", drill: { crescent: 0.5 } },
  { text: "Sweep turn +70% to +110%.", drill: { first: 1.1 } },
  { text: "New: the sweep turn drags the foes it cuts in toward you.", drill: { drag: 14 } },
  { text: "Sweep turn +110% to +200%; crescents twice as hard.", drill: { first: 2, crescent: 1 } },
  { text: "New: crescents pass through every foe in their way.", drill: { pierce: 1 } },
  { text: "Sweep turn +200% to +400%; crescents hit far harder.", drill: { first: 4, crescent: 2.5 } },
]);

export const WHIRLING_EDGE: SkillDef = {
  id: "za_whirling",
  name: "Whirling Edge",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "The sweep turn, the first slash of the chain, hits harder and throws sand crescents out both sides.",
  levels: LEVELS,
  evolution: {
    partner: "za_unbroken",
    name: "Endless Turn",
    text: "Every sweep turn throws two crescents each way, and every slash reaches 25% farther.",
    row: evolvedRow(LEVELS[7], "Two crescents each way; slashes reach 25% farther.", {
      double: 1,
      hold: 1,
      ...drillValues({ double: 1, reach: 0.25 }),
    }),
  },
};
