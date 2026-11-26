import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { behind: 1 } },
  { values: { shortPower: 0.25 } },
  { values: { wave: 0.4, pierce: 1 } },
  { values: { wave: 0.6 } },
  { values: { scissor: 1 } },
  { values: { pierce: 2 } },
  { values: { shortPower: 0.5, wave: 0.8 } },
  { values: { waveTempo: 1 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The moonrise deals 40% more.", drill: { finisher: 0.4 } },
  { text: "New: the moonrise sends two crossing dusk waves ahead for 0.6 AD each.", drill: { wave: 0.6 } },
  { text: "New: the moonrise throws foes higher.", drill: { lift: 300 } },
  { text: "Moonrise +80%; waves 1 AD.", drill: { finisher: 0.8, wave: 1 } },
  { text: "New: the waves cross both ways.", drill: { both: 1 } },
  { text: "Moonrise +150%; waves 1.6 AD.", drill: { finisher: 1.5, wave: 1.6 } },
  { text: "New: the moonrise staggers foes within 50 px.", drill: { stagger: 0.5 } },
  { text: "Moonrise +250%; waves 2.6 AD.", drill: { finisher: 2.5, wave: 2.6 } },
]);

export const CROSSING_STORM: SkillDef = {
  id: "ve_storm",
  name: "Crossing Storm",
  kind: "attack",
  element: "storm",
  risk: "easy",
  button: "J",
  text: "The moonrise, your third cut, hits harder and sends crossing dusk waves.",
  levels: LEVELS,
  evolution: {
    partner: "ve_shade",
    name: "Thousand Crossings",
    text: "The moonrise sends four pairs of waves, two each way, and each foe it cuts takes a night echo.",
    row: evolvedRow(LEVELS[7], "Four wave pairs and an echo on each foe.", { wave: 1 }),
  },
};
