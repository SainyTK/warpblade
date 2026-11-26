import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { riposte: 2 } },
  { values: { open: 2 } },
  { values: { openBonus: 0.3 } },
  { values: { riposte: 4 } },
  { values: { parryTop: 1 } },
  { values: { around: 1 } },
  { values: { openBonus: 0.6 } },
  { values: { blockCut: 1 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The parry window is 40% longer.", drill: { window: 1.4 } },
  { text: "New: a parry cuts the nearest foe for 1 AD, a sure crit.", drill: { cut: 1 } },
  { text: "New: the parry cut staggers.", drill: { stagger: 0.6 } },
  { text: "Parry cut 2 AD.", drill: { cut: 2 } },
  { text: "New: a parry recharges the warp and the air dash.", drill: { warp: 1 } },
  { text: "Window 70% longer; parry cut 3.2 AD.", drill: { window: 1.7, cut: 3.2 } },
  { text: "New: the parry cut hits every foe within 50 px.", drill: { wide: 1 } },
  { text: "Parry cut 6.5 AD.", drill: { cut: 6.5 } },
]);

export const TURNING_BLADE: SkillDef = {
  id: "ve_turn",
  name: "Turning Blade",
  kind: "attack",
  element: "frost",
  risk: "precise",
  button: "K",
  text: "A longer parry window, and a parry turns into a short-blade cut.",
  levels: LEVELS,
  evolution: {
    partner: "ve_keen",
    name: "Whirling Mirror",
    text: "A parry also spins both blades in a ring of night cuts, 3 AD to every foe within 60 px.",
    row: evolvedRow(LEVELS[7], "A parry spins a ring of cuts.", {
      spin: 6,
      spinPower: 0.9,
      ...drillValues({ spin: 60, spinPower: 3 }),
    }),
  },
};
