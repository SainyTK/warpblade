import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { power: 1.4, reach: 120, foes: 1, recharge: 4 } },
  { values: { power: 2.4 } },
  { values: { mark: 0.15 } },
  { values: { foes: 2 } },
  { values: { power: 3.4, reach: 150 } },
  { values: { tempo: 2 } },
  { values: { foes: 3, high: 1 } },
  { values: { power: 4.6, mark: 0.25 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Dusk Thread deals 0.4 AD more.", drill: { bonus: 0.4 } },
  { text: "New: the thread runs on to 1 more foe within 70 px.", drill: { arcs: 1 } },
  { text: "New: the thread staggers.", drill: { stagger: 0.5 } },
  { text: "Thread +0.8 AD.", drill: { bonus: 0.8 } },
  { text: "New: the thread runs on to 2 more foes.", drill: { arcs: 2 } },
  { text: "Thread +1.4 AD.", drill: { bonus: 1.4 } },
  { text: "New: every spell cooldown is 25% shorter.", drill: { preparation: 0.75 } },
  { text: "Thread +2.8 AD; 3 more foes.", drill: { bonus: 2.8, arcs: 3 } },
]);

export const DUSK_THREAD: SkillDef = {
  id: "ve_thread",
  name: "Dusk Thread",
  kind: "spell",
  element: "void",
  risk: "timed",
  button: "I",
  text: "Dusk Thread hits harder and runs on to more foes.",
  levels: LEVELS,
  evolution: {
    partner: "ve_warp",
    name: "Fate Thread",
    text: "A thread hit recharges the warp at once.",
    row: evolvedRow(LEVELS[7], "A thread hit recharges the warp.", { foes: 12, reach: 200, power: 6 }),
  },
};
