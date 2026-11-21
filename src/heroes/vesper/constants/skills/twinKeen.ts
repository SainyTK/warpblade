import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { bonus: 0.4 } },
  { values: { window: 0.14 } },
  { values: { streak: 0.1, streakCap: 0.4 } },
  { values: { bonus: 0.7 } },
  { values: { echoKeen: 0.8 } },
  { values: { keenTop: 1 } },
  { values: { bonus: 1, streakCap: 0.6 } },
  { values: { mp: 3 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "The second cut adds a short-blade cut of 0.35 AD.", drill: { follow: 0.35 } },
  { text: "New: the short-blade cut is a sure crit.", drill: { crit: 1 } },
  { text: "New: the second cut pops the foe up.", drill: { lift: 150 } },
  { text: "Short-blade cut 0.7 AD.", drill: { follow: 0.7 } },
  { text: "New: the second cut marks the foe to take 15% more for 2 s.", drill: { mark: 0.15 } },
  { text: "Short-blade cut 1.2 AD.", drill: { follow: 1.2 } },
  { text: "New: a second short-blade cut follows.", drill: { again: 1 } },
  { text: "Short-blade cut 2.4 AD; mark 25%.", drill: { follow: 2.4, mark: 0.25 } },
]);

export const TWIN_KEEN: SkillDef = {
  id: "ve_keen",
  name: "Twin Keen",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "The rising pair, your second cut, is followed by a quick short-blade cut.",
  levels: LEVELS,
  evolution: {
    partner: "ve_turn",
    name: "Perfect Pair",
    text: "A landed rising pair cuts every foe within 60 px twice with sure crits.",
    row: evolvedRow(LEVELS[7], "The pair cuts every foe near twice.", { cross: 3, ...drillValues({ pair: 60 }) }),
  },
};
