import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { cost: 6, recharge: 1.5, charges: 1 } },
  { values: { thrust: 1 } },
  { values: { perPx: 0.025, cap: 5 } },
  { values: { path: 1 } },
  { values: { charges: 2 } },
  { values: { recharge: 1.1 } },
  { values: { behind: 1 } },
  { values: { strike: 7, path: 2.5 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Warp recharge -15%; warp damage +30%.", drill: { cooldown: 0.85, damage: 0.3 } },
  { text: "New: the arrival blasts foes around for 0.5 AD.", drill: { blast: 36, blastPower: 0.5 } },
  { text: "Warp recharge -25%.", drill: { cooldown: 0.75 } },
  { text: "New: an arrival restores the air dash and the air slash.", drill: { refresh: 1 } },
  { text: "Warp damage +80%; blast 1 AD.", drill: { damage: 0.8, blastPower: 1 } },
  { text: "New: the blast staggers.", drill: { stagger: 0.4 } },
  { text: "Warp recharge -40%; a wider blast.", drill: { cooldown: 0.6, blast: 50 } },
  { text: "Warp damage +200%; blast 2.5 AD.", drill: { damage: 2, blastPower: 2.5 } },
]);

export const WARPCRAFT: SkillDef = {
  id: "k_warpcraft",
  name: "Warpcraft",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Warp Strike recharges faster and hits harder, and its arrival blasts the foes around.",
  levels: LEVELS,
  evolution: {
    partner: "k_passing",
    name: "Rift Walker",
    text: "Once every 4 seconds an arrival recharges the warp at once.",
    row: evolvedRow(LEVELS[7], "Every 4 s an arrival recharges the warp.", {
      ...drillValues({ every: 4 }),
      chain: 3,
      chainEvery: 4,
    }),
  },
};
