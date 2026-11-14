import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `bonus` damage a Keen blow adds on the foe it pays off on, `window` seconds of the Keen window, `streak` more
 *  for each Keen move in a row up to `streakCap`, `echoKeen` a Keen move's echo cut in attack damage, `keenTop` a Keen
 *  moonrise fills Tempo, `mp` MP a Keen move gives, `cross` (evolved) the gold cross cut in attack damage */
const LEVELS = levelRows([
  { text: "A Keen blow deals 40% more.", values: { bonus: 0.4 } },
  { text: "Keen window 0.10 to 0.14 s.", values: { window: 0.14 } },
  { text: "New: each Keen move in a row adds 10% more, up to 40%.", values: { streak: 0.1, streakCap: 0.4 } },
  { text: "Keen bonus 40% to 70%.", values: { bonus: 0.7 } },
  { text: "New: a Keen move sends an echo cut at its foe.", values: { echoKeen: 0.8 } },
  { text: "New: a Keen moonrise fills Tempo to the top.", values: { keenTop: 1 } },
  { text: "Keen bonus 70% to 100%; the streak up to 60%.", values: { bonus: 1, streakCap: 0.6 } },
  { text: "New: a Keen move gives back 3 MP.", values: { mp: 3 } },
]);

export const TWIN_KEEN: SkillDef = {
  id: "ve_keen",
  name: "Twin Keen",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Keen blows, pressed just as a blow lands, hit much harder on their foe.",
  levels: LEVELS,
  evolution: {
    partner: "ve_turn",
    name: "Perfect Pair",
    text: "A Keen move cuts its foe again at once with both blades in gold, 3 times attack damage.",
    row: evolvedRow(LEVELS[7], "A Keen move adds a gold cross cut.", { cross: 3 }),
  },
};
