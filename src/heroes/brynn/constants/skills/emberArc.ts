import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    {
      text: "Each foe Ember Arc hits sends a crescent on along the line.",
      values: { power: 2, recharge: 4, reach: 200, count: 1 },
    },
    { text: "Recharge 4 to 3 s.", values: { recharge: 3 } },
    { text: "New: the crescent sets foes burning.", values: { burn: 2 } },
    { text: "New: the crescent is half again as tall.", values: { size: 0.5 } },
    { text: "Power 2 to 3.5 AP.", values: { power: 3.5 } },
    { text: "New: two crescents, one after the other.", values: { count: 2 } },
    { text: "New: crescents fly the whole screen.", values: { reach: 320 } },
    { text: "Power 3.5 to 5 AP; three crescents.", values: { power: 5, count: 3 } },
  ],
  [
    { text: "Ember Arc sets foes burning 1.5 s longer.", drill: { burn: 1.5 } },
    { text: "New: Ember Arc blasts 20% wider.", drill: { area: 0.2 } },
    { text: "New: a slash on a burning foe flares for 0.5 AD.", drill: { flare: 0.5 } },
    { text: "New: each hit blasts for an extra 0.8 AD.", drill: { blast: 0.8 } },
    { text: "Blasts 40% wider.", drill: { area: 0.4 } },
    { text: "Blast 0.8 to 1.6 AD.", drill: { blast: 1.6 } },
    { text: "New: each cast also throws a crimson crescent.", drill: { crescent: 1.2 } },
    { text: "Blast 1.6 to 3.5 AD.", drill: { blast: 3.5 } },
  ],
);

export const EMBER_ARC: SkillDef = {
  id: "br_arc",
  name: "Ember Arc",
  kind: "spell",
  element: "blaze",
  risk: "easy",
  button: "I",
  text: "Ember Arc burns longer and blasts what it hits.",
  levels: LEVELS,
  evolution: {
    partner: "br_embers",
    name: "Wildfire Arc",
    text: "The crescents turn at the end of their flight and cut back through the line to her.",
    row: evolvedRow(LEVELS[7], "Each hit sends a crescent on.", {
      ...drillValues({ chain: 1.5 }),
      back: 1,
    }),
  },
};
