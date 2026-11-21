import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { cut: 0.8 } },
  { stats: { stamina: 50 } },
  { values: { cut: 1.4 } },
  { values: { rising: 1 } },
  { values: { refund: 10 } },
  { values: { perfect: 3 } },
  { values: { chill: 1.5 } },
  { values: { cut: 4, rising: 2 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "Dashing through foes cuts them for 0.5 AD.", drill: { cut: 0.5 } },
  { text: "Cut 0.5 to 0.9 AD.", drill: { cut: 0.9 } },
  { text: "New: the cut staggers.", drill: { stagger: 0.35 } },
  { text: "New: dashing through a foe recharges the dash at once.", drill: { refund: 1 } },
  { text: "Cut 0.9 to 1.6 AD.", drill: { cut: 1.6 } },
  { text: "New: the cut is a sure critical hit.", drill: { crit: 1 } },
  { text: "Cut 1.6 to 2.5 AD.", drill: { cut: 2.5 } },
  { text: "Cut 2.5 to 4 AD.", drill: { cut: 4 } },
]);

export const PASSING_CUT: SkillDef = {
  id: "k_passing",
  name: "Passing Cut",
  kind: "movement",
  risk: "timed",
  button: "L",
  text: "Dashing through foes cuts every foe passed.",
  levels: LEVELS,
  evolution: {
    partner: "k_skydance",
    name: "Phantom Rush",
    text: "A phantom cuts every passed foe again a moment later.",
    row: evolvedRow(LEVELS[7], "A phantom repeats each cut at 60%.", {
      ...drillValues({ phantom: 0.6 }),
      rush: 3,
      staminaCost: 0.5,
    }),
  },
};
