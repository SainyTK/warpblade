import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Crash and the warp's crash send a 60 px wave at any Groove, 0.5x.",
    values: { reach: 60, power: 0.5, height: 20, pierce: 0, echo: 0, slow: 0, bounce: 0, wall: 0 },
  },
  { text: "The wave stands taller; 0.6x.", values: { height: 30, power: 0.6 } },
  { text: "The wave passes through every foe.", values: { pierce: 1 } },
  { text: "The wave runs 80 px, 0.8x.", values: { reach: 80, power: 0.8 } },
  { text: "At tier 3 a second wave follows on the next beat.", values: { echo: 1 } },
  { text: "Foes it passes are slowed for 1.5 s.", values: { slow: 1.5 } },
  { text: "The wave bounces off the stage edge.", values: { bounce: 1 } },
  { text: "The wave runs 110 px, 1.2x.", values: { reach: 110, power: 1.2 } },
]);

/** Crash Wave. Design: docs/skills/jory.md. Values: reach: pixels the wave runs; power: attack damage it deals; height: pixels it stands; pierce: 1 it passes through every foe; echo: 1 at tier 3 a second wave follows on the next beat; slow: seconds a foe it passes is slowed; bounce: 1 it bounces off the stage edge; wall: 1 it crosses the whole stage both ways and knocks minions down (evolution) */
export const CRASH_WAVE: SkillDef = {
  id: "j_crashWave",
  name: "Crash Wave",
  kind: "attack",
  risk: "easy",
  button: "J",
  text: "Crash and the warp's arrival send a sound wave along the floor at any Groove.",
  levels: LEVELS,
  evolution: {
    partner: "j_horn",
    name: "Wall of Sound",
    text: "The wave crosses the whole stage both ways and knocks minions down.",
    row: evolvedRow(LEVELS[7], "The wave crosses the stage and knocks down.", { wall: 1 }),
  },
};
