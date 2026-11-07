import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `air` added air hits, `stomp` power, `airDash`, `whirl` after a double jump, `airBonus` added air hit damage,
 *  `gravity` the stomp drags flyers down, `meteor` the stomp bounces foes up, `stompReach` pixels each side */
const LEVELS = levelRows([
  { text: "One more air hit: a stomp that knocks foes down.", values: { air: 1, stomp: 2.2, stompReach: 40 } },
  { text: "New: L in the air dashes, once per jump.", values: { airDash: 1 } },
  { text: "New: after a double jump, the first air hit spins both ways.", values: { whirl: 1 } },
  { text: "Air hits +30%.", values: { airBonus: 0.3 } },
  { text: "New: the stomp drags airborne foes down with Kael.", values: { gravity: 1 } },
  { text: "New: the stomp bounces foes up for a fresh launch.", values: { meteor: 1 } },
  { text: "Stomp reach 40 to 60 px; air hits +60%.", values: { stompReach: 60, airBonus: 0.6 } },
  { text: "Stomp power 2.2 to 6.", values: { stomp: 6 } },
]);

export const SKY_DANCE: SkillDef = {
  id: "k_skydance",
  name: "Sky Dance",
  kind: "movement",
  risk: "timed",
  button: "jump",
  text: "One more attack in the air, ending in a stomp, and later an air dash.",
  levels: LEVELS,
  evolution: {
    partner: "k_reap",
    name: "Comet Dance",
    text: "Air hits drop crystal shards on the foe below, and the stomp lands as a comet that draws foes in.",
    row: evolvedRow(LEVELS[7], "Air hits drop shards; the stomp is a comet.", { shard: 1.5, comet: 8, cometReach: 90 }),
  },
};
