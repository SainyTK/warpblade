import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { launch: 2.65, crashReach: 30 } },
  { values: { wide: 1 } },
  { values: { launch: 3.95 } },
  { values: { airBonus: 0.3 } },
  { values: { crash: 1.2 } },
  { values: { behind: 1 } },
  { values: { airBonus: 0.6, crash: 2 } },
  { values: { launch: 8.2, crash: 3.5, crashReach: 45 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The third slash launches foes into the air.", drill: { lift: 0.3, launch: 1 } },
  { text: "Air slashes deal +30%.", drill: { air: 0.3 } },
  { text: "New: an air slash on a foe in the air spikes it down.", drill: { spike: 0.8 } },
  { text: "Launch cut 0.3 to 0.8 AD.", drill: { lift: 0.8 } },
  { text: "Air slashes +30% to +60%.", drill: { air: 0.6 } },
  { text: "Spike 0.8 to 1.6 AD.", drill: { spike: 1.6 } },
  { text: "Air slashes +60% to +100%; launch cut 1.5 AD.", drill: { air: 1, lift: 1.5 } },
  { text: "Spike 1.6 to 4 AD.", drill: { spike: 4 } },
]);

export const SKYBREAKER: SkillDef = {
  id: "k_skyward",
  name: "Skybreaker",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "The third slash launches foes, and air slashes hit harder and spike them down.",
  levels: LEVELS,
  evolution: {
    partner: "k_skydance",
    name: "Heavenfall",
    text: "A spike crashes into the foes below it and stuns them.",
    row: evolvedRow(LEVELS[7], "Spikes crash on foes within 40 px.", {
      ...drillValues({ quake: 40 }),
      spike: 15,
      shockReach: 60,
    }),
  },
};
