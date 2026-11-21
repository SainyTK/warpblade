import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  {
    values: { power: 1.6, radius: 34, burn: 1.5, recharge: 10, flasks: 1 },
  },
  { values: { stun: 0.5 } },
  { values: { floor: 2 } },
  { values: { power: 2.4, recharge: 7, burn: 3 } },
  { values: { ignite: 2 } },
  { values: { radius: 50 } },
  { values: { flasks: 2 } },
  { values: { power: 4, burn: 4 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Fire sets foes burning for 2 s.", drill: { burn: 2 } },
  { text: "New: fire hits 0.5 AD harder.", drill: { blast: 0.5 } },
  { text: "New: fire knocks foes off balance.", drill: { knock: 0.4 } },
  { text: "Burns 2 to 4 s; fire 1 AD harder.", drill: { burn: 4, blast: 1 } },
  { text: "New: a slash on a burning foe flares around it for 0.6 AD.", drill: { flare: 0.6 } },
  { text: "Every spell blast is 20% wider.", drill: { area: 0.2 } },
  { text: "New: Fire throws two flasks.", drill: { flasks: 1 } },
  { text: "Fire 2.5 AD harder; flare 1.5 AD.", drill: { blast: 2.5, flare: 1.5 } },
]);

export const FIRE_FLASK: SkillDef = {
  id: "k_flame",
  name: "Fire Flask",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "Fire sets foes burning, and the sword makes burning foes flare.",
  levels: LEVELS,
  evolution: {
    partner: "k_familiar",
    name: "Sunflask",
    text: "Each fire blast throws three smaller blasts at the foes near it.",
    row: evolvedRow(LEVELS[7], "Each fire blast throws three more.", {
      ...drillValues({ children: 3 }),
      children: 3,
    }),
  },
};
