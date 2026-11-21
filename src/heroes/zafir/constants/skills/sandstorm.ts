import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type Numbers } from "./drillLevels";

const NATIVE: readonly Numbers[] = [
  { power: 1.3 },
  { cooldown: 15, charge: 1.3 },
  { time: 1.5, grains: 1.5 },
  { blind: 1 },
  { power: 1.9 },
  { wounds: 1 },
  { reach: 1.4 },
  { power: 4.8 },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Sandstorm tiers deal +30%.", drill: { damage: 1.3 } },
  { text: "New: the tiers charge 25% faster.", drill: { charge: 1.25 } },
  { text: "New: the storm of the high tiers lasts half again as long.", drill: { storm: 0.5 } },
  { text: "Tiers +30% to +70%.", drill: { damage: 1.7 } },
  { text: "New: minions inside the storm cannot see you.", drill: { blind: 1 } },
  { text: "New: the tiers reach 30% farther.", drill: { reach: 1.3 } },
  { text: "New: every foe a tier strikes bleeds two wounds.", drill: { wounds: 2 } },
  { text: "Tiers +70% to +250%.", drill: { damage: 3.5 } },
]);

export const SANDSTORM: SkillDef = {
  id: "za_storm",
  name: "Sandstorm",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: "The four Sandstorm tiers hit harder, charge faster, reach farther and leave the storm turning longer.",
  levels: LEVELS,
  evolution: {
    partner: "za_whirling",
    name: "Endless Sirocco",
    text: "Every tier from the third raises a second, wider storm, and every storm lasts twice as long.",
    row: evolvedRow(LEVELS[7], "A second, wider storm; twice as long.", {
      twin: 1.5,
      time: 2,
      ...drillValues({ twin: 1, storm: 1.5 }),
    }),
  },
};
