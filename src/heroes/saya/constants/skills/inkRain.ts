import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillRows, drillValues } from "./drillRows";
import { SKILL } from "./ids";

/** values: `drop` ability power each drop deals, `store` ability power it stores, `time` s the rain falls, `width` px
 *  it covers, `recharge` s, `stagger` s each drop staggers, `follow` the cloud drifts after the nearest foe, `pin` s a
 *  foe struck by five drops is held, `last` ability power of the great drop that ends it, `clouds` how many clouds */
const LEVELS = levelRows([
  {
    text: "Learn Ink Rain: ink falls ahead for 1.5 s, each drop storing a cut.",
    values: { drop: 0.25, store: 0.4, time: 1.5, width: 50, recharge: 6, clouds: 1 },
  },
  { text: "Rain lasts 1.5 to 2 s.", values: { time: 2 } },
  { text: "New: each drop staggers the foe it hits.", values: { stagger: 0.18 } },
  { text: "Drop store +50%.", values: { store: 0.6 } },
  { text: "New: the cloud drifts after the nearest foe.", values: { follow: 1 } },
  { text: "New: the rain ends in one great drop that knocks foes down; width 70 px.", values: { last: 2, width: 70 } },
  { text: "New: a foe struck by five drops is pinned for a moment.", values: { pin: 0.6 } },
  { text: "Drop cut and store +150%.", values: { drop: 0.6, store: 1.5 } },
]);

const DRILL = drillRows(LEVELS, [
  { text: "Ink Rain holds foes 0.5 s longer.", drill: { hold: 0.5 } },
  { text: "Ink Rain +40%.", drill: { power: 0.4 } },
  { text: "New: Ink Rain marks foes: they take 15% more damage for 3 s.", drill: { mark: 0.15 } },
  { text: "Ink Rain +40% to +90%.", drill: { power: 0.9 } },
  { text: "New: a second shower falls a beat later for 50%.", drill: { second: 0.5 } },
  { text: "Ink Rain +90% to +160%.", drill: { power: 1.6 } },
  { text: "New: the mark grows to 30%.", drill: { mark: 0.3 } },
  { text: "Ink Rain +160% to +320%.", drill: { power: 3.2 } },
]);

export const INK_RAIN: SkillDef = {
  id: SKILL.rain,
  name: "Ink Rain",
  kind: "spell",
  element: "void",
  risk: "easy",
  button: "I",
  text: "Ink Rain hits harder, holds foes longer and marks them.",
  levels: DRILL,
  evolution: {
    partner: SKILL.stain,
    name: "Monsoon",
    text: "Ink Rain keeps falling: three more showers.",
    row: evolvedRow(DRILL[7], "Three more showers.", {
      ...drillValues({ showers: 3 }),
      clouds: 2,
      store: 3,
    }),
  },
};
