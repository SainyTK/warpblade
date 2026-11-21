import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { hold: 0.5 } },
  { values: { keep: 0.5 } },
  { values: { most: 2 } },
  { values: { topMove: 0.1 } },
  { values: { hold: 1 } },
  { values: { topMp: 6 } },
  { values: { topKeep: 1 } },
  { values: { most: 4 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "A landed cut takes 0.15 s off the warp recharge.", drill: { warp: 0.15 } },
  { text: "New: a warp arrival takes 0.6 s off a spell preparing.", drill: { prepare: 0.6 } },
  { text: "New: an arrival recharges the dash.", drill: { dash: 1 } },
  { text: "0.25 s a landed cut.", drill: { warp: 0.25 } },
  { text: "New: a landed moonrise recharges the warp.", drill: { finisher: 1 } },
  { text: "An arrival takes 1.2 s off a preparation.", drill: { prepare: 1.2 } },
  { text: "New: infused blades hold 1 more hit.", drill: { infusion: 1 } },
  { text: "0.4 s a landed cut; 2 s off a preparation.", drill: { warp: 0.4, prepare: 2 } },
]);

export const UNBROKEN_RHYTHM: SkillDef = {
  id: "ve_rhythm",
  name: "Unbroken Rhythm",
  kind: "movement",
  risk: "easy",
  button: "L",
  text: "Landed cuts shorten the warp's recharge, and arrivals speed up your spells.",
  levels: LEVELS,
  evolution: {
    partner: "ve_slip",
    name: "Perpetual Tempo",
    text: "Every warp arrival readies the selected spell at once.",
    row: evolvedRow(LEVELS[7], "Every arrival readies the spell.", { floor: 0.5 }),
  },
};
