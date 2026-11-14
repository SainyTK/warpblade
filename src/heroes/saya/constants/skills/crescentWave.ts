import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: `now` ability power each foe takes as the crescent passes, `store` ability power it stores, `recharge` s,
 *  `launch` it throws foes up this fast, `slow` seconds the foes it cuts are slowed, `pair` a second crescent low, `burst` ability power of the burst at the
 *  end of its flight, `tall` the factor on its height and `range` px it flies */
const LEVELS = levelRows([
  {
    text: "Learn Crescent Wave: an ink crescent flies ahead, storing a cut in each foe.",
    values: { now: 0.5, store: 1.2, recharge: 4, tall: 1, range: 150 },
  },
  { text: "Store +50%.", values: { store: 1.8 } },
  { text: "New: the crescent slows the foes it cuts.", values: { slow: 1.5 } },
  { text: "New: the crescent throws light foes up; recharge 3 s.", values: { launch: 160, recharge: 3 } },
  { text: "New: a second crescent flies low beside the first.", values: { pair: 1 } },
  { text: "Store +50% to +150%.", values: { store: 3 } },
  { text: "New: the crescent bursts where its flight ends.", values: { burst: 1.5 } },
  { text: "Cut and store +100%.", values: { now: 1, store: 6 } },
]);

export const CRESCENT_WAVE: SkillDef = {
  id: SKILL.crescent,
  name: "Crescent Wave",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "An ability on I: an ink crescent flies ahead through every foe and stores a cut in each. Held, three of them.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.rain,
    name: "Tide Moon",
    text: "The crescent is twice as tall and crosses the whole stage.",
    row: evolvedRow(LEVELS[7], "Twice as tall; crosses the whole stage.", { tall: 2, range: 320 }),
  },
};
