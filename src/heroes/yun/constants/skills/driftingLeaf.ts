import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillEvolved, onDrill } from "./drill";

/** values: `cut` attack damage of the cut on each foe dodged through, `sword` seconds between spirit swords a dodge through a foe gives, `refund` share of the dodge's stamina given back, `wave` power of the qi wave sent where the dodge ends, `chill` seconds foes dodged through are slowed, `twice` the cut lands twice and the wave runs both ways */
const LEVELS = levelRows([
  { text: "A spirit sword cuts each foe you dodge through.", values: { cut: 0.6 } },
  { text: "Cut power 0.6 to 0.9.", values: { cut: 0.9 } },
  { text: "New: dodging through a foe gives a spirit sword, once every 3 s.", values: { sword: 3 } },
  { text: "Cut power 0.9 to 1.2.", values: { cut: 1.2 } },
  { text: "New: a third of the dodge's stamina comes back.", values: { refund: 0.33 } },
  { text: "Cut power 1.2 to 2.2.", values: { cut: 2.2 } },
  { text: "New: where the dodge ends a qi wave runs on ahead.", values: { wave: 1 } },
  { text: "New: foes you dodge through are slowed 1.5 s; cut power 3.5.", values: { chill: 1.5, cut: 3.5 } },
]);

const DRILL_LEVELS = onDrill(LEVELS, [
  { text: "Dashing through a foe cuts it for 0.8 AD.", drill: { cut: 0.8 } },
  { text: "New: dash cuts stagger.", drill: { stagger: 0.4 } },
  { text: "New: a dash through a foe recharges the dash.", drill: { refund: 1 } },
  { text: "Cut 0.8 to 1.6 AD.", drill: { cut: 1.6 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "Cut 3 AD.", drill: { cut: 3 } },
  { text: "New: cut foes take 15% more damage for 3 s.", drill: { mark: 0.15 } },
  { text: "Cut 6 AD.", drill: { cut: 6 } },
]);

export const DRIFTING_LEAF: SkillDef = {
  id: "yu_drift",
  name: "Drifting Leaf",
  kind: "movement",
  risk: "easy",
  button: "L",
  text: "Dashing through foes cuts them.",
  levels: DRILL_LEVELS,
  evolution: {
    partner: "yu_cloud",
    name: "Leaf on the Wind",
    text: "Each dash cuts twice.",
    row: drillEvolved(
      DRILL_LEVELS[7],
      evolvedRow(LEVELS[7], "Two cuts; waves both ways.", { twice: 1 }),
      "Dash cuts land twice.",
      {},
    ),
  },
};
