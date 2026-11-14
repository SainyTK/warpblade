import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `keen` share of extra power a Keen blow deals on its foe, `window` seconds added to Keen timing, `sword` seconds between spirit swords a Keen blow gives, `wave` power of the qi wave a Keen blow sends, in attack damage, `waves` how many waves, `lift` a Keen blow throws an airborne foe up */
const LEVELS = levelRows([
  { text: "A Keen blow hits 40% harder on its foe.", values: { keen: 0.4 } },
  { text: "Keen bonus 40% to 70%.", values: { keen: 0.7 } },
  { text: "New: Keen timing is 0.05 s longer.", values: { window: 0.05 } },
  { text: "Keen bonus 70% to 100%.", values: { keen: 1 } },
  { text: "New: a Keen blow gives a spirit sword, once every 2 s.", values: { sword: 2 } },
  { text: "Keen bonus 100% to 140%.", values: { keen: 1.4 } },
  { text: "New: a Keen blow sends a qi wave at its foe.", values: { wave: 1, waves: 1 } },
  {
    text: "New: a Keen blow on a foe in the air throws it higher; bonus 200%.",
    values: { keen: 2, wave: 1.6, lift: 1 },
  },
]);

export const FLOWING_WATER: SkillDef = {
  id: "yu_flow",
  name: "Flowing Water",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Keen blows hit far harder, give spirit swords and send qi waves.",
  levels: LEVELS,
  evolution: {
    partner: "yu_echo",
    name: "Still Water",
    text: "Keen blows deal three times their power on their foe and send three qi waves.",
    row: evolvedRow(LEVELS[7], "Keen bonus 300%; three waves.", { keen: 3, waves: 3 }),
  },
};
