import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `cut` attack damage of the cut on each foe dodged through, `sword` seconds between spirit swords a dodge through a foe gives, `refund` share of the dodge's stamina given back, `wave` power of the qi wave sent where the dodge ends, `chill` seconds foes dodged through are slowed, `twice` the cut lands twice and the wave runs both ways */
const LEVELS = levelRows([
  { text: "A spirit sword cuts each foe you dodge through.", values: { cut: 0.6 } },
  { text: "Cut power 0.6 to 0.9.", values: { cut: 0.9 } },
  { text: "New: dodging through a foe gives a spirit sword, once every 3 s.", values: { sword: 3 } },
  { text: "Cut power 0.9 to 1.2.", values: { cut: 1.2 } },
  { text: "New: a third of the dodge's stamina comes back.", values: { refund: 0.33 } },
  { text: "Cut power 1.2 to 1.6.", values: { cut: 1.6 } },
  { text: "New: where the dodge ends a qi wave runs on ahead.", values: { wave: 1 } },
  { text: "New: foes you dodge through are slowed 1.5 s; cut power 2.", values: { chill: 1.5, cut: 2 } },
]);

export const DRIFTING_LEAF: SkillDef = {
  id: "yu_drift",
  name: "Drifting Leaf",
  kind: "movement",
  risk: "easy",
  button: "L",
  text: "Spirit swords cut every foe you dodge through, and the dodge brings swords, waves and slows.",
  levels: LEVELS,
  evolution: {
    partner: "yu_cloud",
    name: "Leaf on the Wind",
    text: "The cut lands twice and the wave runs both ways.",
    row: evolvedRow(LEVELS[7], "Two cuts; waves both ways.", { twice: 1 }),
  },
};
