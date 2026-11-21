import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues, type NativeStep } from "./drillLevels";

const NATIVE: readonly NativeStep[] = [
  { values: { air: 1, stomp: 2.2, stompReach: 40 } },
  { values: { airDash: 1 } },
  { values: { whirl: 1 } },
  { values: { airBonus: 0.3 } },
  { values: { gravity: 1 } },
  { values: { meteor: 1 } },
  { values: { stompReach: 60, airBonus: 0.6 } },
  { values: { stomp: 6 } },
];

const LEVELS = drillLevels(NATIVE, [
  { text: "One more air slash per jump.", drill: { airSlashes: 1 } },
  { text: "New: a wall kick cuts foes at the wall for 0.6 AD.", drill: { kick: 0.6 } },
  { text: "New: landing after an air slash stomps foes for 0.6 AD.", drill: { stomp: 0.6 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "Kick and stomp 1.2 AD.", drill: { kick: 1.2, stomp: 1.2 } },
  { text: "A third air slash per jump.", drill: { airSlashes: 2 } },
  { text: "Kick and stomp 2 AD.", drill: { kick: 2, stomp: 2 } },
  { text: "Kick and stomp 4 AD.", drill: { kick: 4, stomp: 4 } },
]);

export const SKY_DANCE: SkillDef = {
  id: "k_skydance",
  name: "Sky Dance",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "One more air slash, wall kicks that cut, and a stomp after air slashes.",
  levels: LEVELS,
  evolution: {
    partner: "k_reap",
    name: "Comet Dance",
    text: "The stomp lands as a comet that reaches 70 px and draws foes in.",
    row: evolvedRow(LEVELS[7], "The stomp is a comet: 70 px, drawing foes in.", {
      ...drillValues({ comet: 70 }),
      shard: 1.5,
      comet: 8,
      cometReach: 90,
    }),
  },
};
