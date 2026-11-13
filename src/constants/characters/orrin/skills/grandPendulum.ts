import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** Grand Pendulum, his ultimate skill. Design: docs/skills/orrin.md. Values: passes: wide passes under the tear; power:
 *  share of the level's power each pass and turn deals each foe; pull: 1 a pass drags the foes it meets to the bottom of
 *  the arc; radius: the chain's length in pixels; shards: share of the level's power the chain shards of each pass and
 *  turn deal foes on the floor beneath; crash: share of the level's power of the crash ring; stun: seconds the crash
 *  stuns; turns: full turns round the tear after the passes; burst: share of the level's power the foes drawn in under
 *  the tear burst for together at the end (evolution) */
const LEVELS = levelRows([
  { text: "Three passes, each 0.6x the level's power.", values: { passes: 3, power: 0.6, crash: 1 } },
  { text: "New: each pass drags the foes it meets under the tear.", values: { pull: 1 } },
  { text: "A longer chain, radius 110; passes deal 0.8x.", values: { radius: 110, power: 0.8 } },
  { text: "New: each pass sprays chain shards on the floor, 0.5x.", values: { shards: 0.5 } },
  { text: "New: the crash deals 2x and stuns for 1 s.", values: { crash: 2, stun: 1 } },
  { text: "New: after the passes he loops a full turn round the tear.", values: { turns: 1 } },
  { text: "Passes and turns deal 1.2x.", values: { power: 1.2 } },
  { text: "Two full turns; passes 1.4x, the crash 3x.", values: { turns: 2, power: 1.4, crash: 3 } },
]);

export const GRAND_PENDULUM_SKILL: SkillDef = {
  id: "o_grandpendulum",
  name: "Grand Pendulum",
  kind: "ultimate",
  risk: "timed",
  button: "U",
  text: "Grand Pendulum swings more passes, drags foes under the tear, and ends in full turns round it.",
  levels: LEVELS,
  evolution: {
    partner: "o_pump",
    name: "Maelstrom",
    text: "Four full turns in a circle as tall as the screen, and the foes drawn in under the tear burst together at the end.",
    row: evolvedRow(LEVELS[7], "Four turns, a giant circle, a final burst.", {
      turns: 4,
      radius: 140,
      power: 2.2,
      burst: 8,
    }),
  },
};
