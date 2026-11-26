import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  {
    values: { power: 1.6, spikes: 4, freeze: 0.8, recharge: 9 },
  },
  { values: { spikes: 6 } },
  { values: { power: 2.4, freeze: 1.4 } },
  { values: { shatter: 0.8 } },
  { values: { chill: 2, recharge: 6.5 } },
  { values: { frozenBonus: 0.25 } },
  { values: { burst: 1 } },
  { values: { power: 7, shatter: 3.5 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Ice freezes foes 0.5 s longer.", drill: { freeze: 0.5 } },
  { text: "New: a slash on a frozen foe shatters it for 1 AD.", drill: { shatter: 1 } },
  { text: "New: ice hits 0.4 AD harder.", drill: { spike: 0.4 } },
  { text: "Freeze 1 s longer; shatter 2 AD.", drill: { freeze: 1, shatter: 2 } },
  { text: "New: ice chills the foes around.", drill: { chill: 2 } },
  { text: "New: a shatter splashes foes near for 0.8 AD.", drill: { splash: 0.8 } },
  { text: "Shatter 4 AD; splash 1.5 AD.", drill: { shatter: 4, splash: 1.5 } },
  { text: "Freeze 1.5 s longer; shatter 7 AD.", drill: { freeze: 1.5, shatter: 7 } },
]);

export const ICE_SPIKES: SkillDef = {
  id: "k_frost",
  name: "Ice Spikes",
  kind: "spell",
  element: "frost",
  risk: "timed",
  button: "I",
  text: "Ice freezes longer, and a slash shatters a frozen foe.",
  levels: LEVELS,
  evolution: {
    partner: "k_reap",
    name: "Glacier Bloom",
    text: "A shatter freezes the foes it splashes.",
    row: evolvedRow(LEVELS[7], "Shatters freeze the foes they splash.", {
      ...drillValues({ bloom: 1.5 }),
      bloom: 1,
      spire: 3,
      bloomPower: 1.5,
    }),
  },
};
