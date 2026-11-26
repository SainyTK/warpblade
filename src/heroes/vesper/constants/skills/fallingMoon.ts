import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { power: 2, moons: 1, radius: 26, recharge: 5 } },
  { values: { power: 3 } },
  { values: { moons: 2 } },
  { values: { launch: 1, radius: 32 } },
  { values: { glow: 3 } },
  { values: { power: 4.6, recharge: 4.2 } },
  { values: { moons: 3 } },
  { values: { power: 6, recharge: 3.5 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Falling Moon deals 0.4 AD more.", drill: { bonus: 0.4 } },
  { text: "New: a second moon falls on the same spot for 0.5 AD.", drill: { second: 0.5 } },
  { text: "New: the moon staggers.", drill: { stagger: 0.4 } },
  { text: "Moon +0.8 AD; second moon 1 AD.", drill: { bonus: 0.8, second: 1 } },
  { text: "New: the moon draws in foes within 50 px.", drill: { pull: 50 } },
  { text: "Moon +1.4 AD; second moon 1.7 AD.", drill: { bonus: 1.4, second: 1.7 } },
  { text: "New: a moon-infused cut drops a small moon for 0.8 AD.", drill: { small: 0.8 } },
  { text: "Moon +2.8 AD; second moon 3.2 AD.", drill: { bonus: 2.8, second: 3.2, small: 1.6 } },
]);

export const FALLING_MOON: SkillDef = {
  id: "ve_moon",
  name: "Falling Moon",
  kind: "spell",
  element: "frost",
  risk: "easy",
  button: "I",
  text: "Falling Moon strikes harder and drops more moons.",
  levels: LEVELS,
  evolution: {
    partner: "ve_hex",
    name: "Eclipse",
    text: "Each moon brings an eclipse: three more moons fall around it for 1.8 AD each.",
    row: evolvedRow(LEVELS[7], "Three more moons fall around each.", {
      moons: 5,
      pull: 1,
      radius: 36,
      ...drillValues({ eclipse: 1.8 }),
    }),
  },
};
