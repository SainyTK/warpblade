import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
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
  { text: "Cut +40%; store +33%.", values: { now: 0.7, store: 4 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "Crescent Wave stores 1x AP in each foe it strikes.", drill: { store: 1 } },
  { text: "Crescent Wave +40%.", drill: { power: 0.4 } },
  { text: "New: Crescent Wave staggers.", drill: { stagger: 0.4 } },
  { text: "Crescent Wave +40% to +90%.", drill: { power: 0.9 } },
  { text: "New: Crescent-infused hits store 0.5x AP more.", drill: { infused: 0.5 } },
  { text: "Crescent Wave +90% to +160%.", drill: { power: 1.6 } },
  { text: "New: Crescent Wave chills.", drill: { chill: 1.5 } },
  { text: "Crescent Wave +160% to +320%; the store doubles.", drill: { power: 3.2, store: 2 } },
]);

export const CRESCENT_WAVE: SkillDef = {
  id: SKILL.crescent,
  name: "Crescent Wave",
  kind: "spell",
  element: "void",
  risk: "easy",
  button: "I",
  text: "Crescent Wave hits harder and stores a cut in every foe it strikes.",
  levels: DRILL,
  evolution: {
    partner: SKILL.rain,
    name: "Tide Moon",
    text: "Each Crescent Wave hit calls a small shower of Ink Rain on the foe.",
    row: evolvedRow(DRILL[7], "A crescent hit calls a shower of Ink Rain.", {
      ...drillValues({ shower: 1 }),
      tall: 2,
      range: 320,
    }),
  },
};
