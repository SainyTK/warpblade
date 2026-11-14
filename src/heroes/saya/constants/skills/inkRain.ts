import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
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

export const INK_RAIN: SkillDef = {
  id: SKILL.rain,
  name: "Ink Rain",
  kind: "spell",
  risk: "easy",
  button: "I",
  text: "An ability on I: a cloud of ink rains on the foes ahead, each drop storing a small cut. Held, it falls twice as long.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.stain,
    name: "Monsoon",
    text: "Two clouds rain at once, one each side of her, and every drop stores twice.",
    row: evolvedRow(LEVELS[7], "Two clouds; each drop stores twice.", { clouds: 2, store: 3 }),
  },
};
