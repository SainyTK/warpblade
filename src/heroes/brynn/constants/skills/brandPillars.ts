import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` AP of each pillar, `count` pillars, `recharge` seconds, `gap` pixels between pillars, `burn` seconds
 *  foes burn, `stun` seconds foes lie down, `halt` seconds foes are held in place, `again` the line erupts a second time at this share, `third` and a third
 *  time at this share */
const LEVELS = levelRows([
  {
    text: "Learn Brand Pillars: crimson pillars burst from the floor one after another ahead.",
    values: { power: 1.3, count: 4, recharge: 6, gap: 22 },
  },
  { text: "New: five pillars, and foes they strike are held in place a moment.", values: { count: 5, halt: 0.8 } },
  { text: "New: pillars set foes burning.", values: { burn: 2 } },
  { text: "Power 1.3 to 2.2 AP.", values: { power: 2.2 } },
  { text: "New: foes a pillar throws up lie down after.", values: { stun: 0.8 } },
  { text: "Seven pillars; recharge 6 to 5 s.", values: { count: 7, recharge: 5 } },
  { text: "New: the line erupts again a moment later.", values: { again: 0.6 } },
  { text: "Power 2.2 to 4.4 AP; the second line as hard.", values: { power: 4.4, again: 1 } },
]);

export const BRAND_PILLARS: SkillDef = {
  id: "br_pillars",
  name: "Brand Pillars",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "An ability: crimson pillars burst out of the floor in a line ahead and throw foes up. Held, both ways.",
  levels: LEVELS,
  evolution: {
    partner: "br_fault",
    name: "Pillar Forest",
    text: "The line erupts three times, and the last time twice as hard.",
    row: evolvedRow(LEVELS[7], "Three eruptions; the last twice as hard.", { again: 1, third: 2 }),
  },
};
