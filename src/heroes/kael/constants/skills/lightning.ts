import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  {
    values: { power: 2.5, arcs: 1, arcPower: 1.2, recharge: 6 },
  },
  { values: { stun: 0.5 } },
  { values: { power: 3.5, arcs: 2 } },
  { values: { swordBonus: 0.2 } },
  { values: { arcs: 4, recharge: 4.5 } },
  { values: { twice: 1 } },
  { values: { behind: 1 } },
  { values: { power: 7, arcPower: 2.5 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Thunder arcs to 1 more foe.", drill: { arcs: 1, arc: 0.6 } },
  { text: "New: the struck foe takes an extra bolt.", drill: { bolt: 0.5 } },
  { text: "New: the arcs shock foes.", drill: { shock: 1 } },
  { text: "Arcs to 2 more foes.", drill: { arcs: 2 } },
  { text: "New: thunder-infused slashes arc too.", drill: { infused: 1 } },
  { text: "Arcs hit twice as hard.", drill: { arc: 1.2 } },
  { text: "Arcs to 4 more foes.", drill: { arcs: 4 } },
  { text: "Arcs and the bolt hit far harder.", drill: { arc: 2.5, bolt: 2 } },
]);

export const LIGHTNING: SkillDef = {
  id: "k_volt",
  name: "Lightning",
  kind: "spell",
  element: "storm",
  risk: "easy",
  button: "I",
  text: "Thunder arcs on to more foes, and thunder-infused slashes arc too.",
  levels: LEVELS,
  evolution: {
    partner: "k_static",
    name: "Thunderhead",
    text: "Thunder strikes the same foe again 0.3 s later.",
    row: evolvedRow(LEVELS[7], "Thunder strikes twice.", {
      ...drillValues({ again: 0.3 }),
      cloud: 5,
      cloudArcs: 2,
    }),
  },
};
