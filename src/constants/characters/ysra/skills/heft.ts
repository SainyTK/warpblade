import type { SkillDef } from "../../../../types/skill";
import { evolved, grow } from "./rows";

/**
 * windRate: the heft winds this many times faster; power: a full lunge's attack damage multiple; travel: pixels of a
 * full lunge; reach: pixels every glaive blow gains; skewer: the slam's share of the lunge (0 off); rail: the second
 * pass's share (0 off); guardAll: untouchable for the whole travel; tip: the tip burst's power (0 off); back: the rail
 * runs back as well; charged: J while charging releases a full lunge
 */
const levels = grow({ windRate: 1, power: 3, travel: 60, reach: 0, skewer: 0, rail: 0, guardAll: 0, tip: 0 }, [
  ["Hold J: a faster wind and a harder lunge.", { windRate: 1.25, power: 4.2 }],
  ["The lunge runs farther and every blow reaches further.", { travel: 80, reach: 6 }],
  ["A full lunge carries a foe and slams it down.", { skewer: 1 }],
  ["Lunge damage +20%.", { power: 5 }],
  ["The line is struck again after the lunge.", { rail: 0.5 }],
  ["Winds faster; nothing touches you in the lunge.", { windRate: 1.6, guardAll: 1 }],
  ["The lunge bursts at its tip.", { tip: 1.5 }],
  ["Lunge damage much higher.", { power: 10 }],
]);

/** Deep Heft: the held lunge winds faster and learns to carry, rail and burst */
export const HEFT: SkillDef = {
  id: "y_heft",
  name: "Deep Heft",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Hold J: the lunge winds faster and hits harder.",
  levels,
  evolution: {
    partner: "y_warpath",
    name: "Rail Lance",
    text: "A full lunge runs 140 px and the rail strikes the line out and back. J while charging lunges at once.",
    row: evolved(levels, "The lunge rails out and back.", { travel: 140, rail: 0.6, back: 1, charged: 1 }),
  },
};
