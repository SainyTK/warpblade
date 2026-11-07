import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` of the blink strike, `keep` the combo goes on, `keen` a blink in the Keen beat is a sure crit, `lock`
 *  seconds the foe cannot turn, `recharge` its own wait, `after` power of the afterimage's cut */
const LEVELS = levelRows([
  { text: "K during a combo blinks behind the foe and strikes.", values: { power: 1.8 } },
  { text: "New: the combo goes on after the blink.", values: { keep: 1 } },
  { text: "Blink strike power 1.8 to 2.8.", values: { power: 2.8 } },
  { text: "New: a blink in the Keen beat is a sure crit.", values: { keen: 1 } },
  { text: "New: the foe cannot turn for 1.2 s.", values: { lock: 1.2 } },
  { text: "New: the blink has its own 1.2 s recharge.", values: { recharge: 1.2 } },
  { text: "New: an afterimage cuts where Kael stood.", values: { after: 1.2 } },
  { text: "Blink strike power 2.8 to 7; the foe cannot turn for 2 s.", values: { power: 7, lock: 2 } },
]);

export const BLINK_STEP: SkillDef = {
  id: "k_blink",
  name: "Blink Step",
  kind: "movement",
  risk: "timed",
  button: "K",
  text: "Press K during a combo to step through to the foe's back and strike.",
  levels: LEVELS,
  evolution: {
    partner: "k_echo",
    name: "Shadow Step",
    text: "A phantom cuts from the near side as Kael blinks, and a blink that kills is free.",
    row: evolvedRow(LEVELS[7], "A phantom strikes with every blink; kills refund it.", { shadow: 1 }),
  },
};
