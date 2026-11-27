import type { SkillDef } from "../../../../types/skill";
import { evolvedRow } from "../../../../utils/skillRows";
import { drillLevels, drillValues } from "./drillLevels";

const LEVELS = drillLevels(
  [
    {
      text: "Quake strikes again half a second later.",
      values: { power: 1.3, count: 4, recharge: 6, gap: 22 },
    },
    { text: "New: five pillars, and foes they strike are held in place a moment.", values: { count: 5, halt: 0.8 } },
    { text: "New: pillars set foes burning.", values: { burn: 2 } },
    { text: "Power 1.3 to 2.2 AP.", values: { power: 2.2 } },
    { text: "New: foes a pillar throws up lie down after.", values: { stun: 0.8 } },
    { text: "Seven pillars; recharge 6 to 5 s.", values: { count: 7, recharge: 5 } },
    { text: "New: the line erupts again a moment later.", values: { again: 0.6 } },
    { text: "Power 2.2 to 4.4 AP; the second line as hard.", values: { power: 4.4, again: 1 } },
  ],
  [
    { text: "Quake raises 2 crimson pillars where it strikes, 0.6 AD each.", drill: { count: 2, power: 0.6 } },
    { text: "New: three pillars.", drill: { count: 3 } },
    { text: "New: Quake staggers 0.5 s longer.", drill: { stagger: 0.5 } },
    { text: "Pillars 0.6 to 1.2 AD.", drill: { power: 1.2 } },
    { text: "New: Quake hits 20% wider.", drill: { area: 0.2 } },
    { text: "New: five pillars.", drill: { count: 5 } },
    { text: "New: pillars set foes burning.", drill: { burn: 2 } },
    { text: "Pillars 1.2 to 3 AD.", drill: { power: 3 } },
  ],
);

export const BRAND_PILLARS: SkillDef = {
  id: "br_pillars",
  name: "Brand Pillars",
  kind: "spell",
  element: "blaze",
  risk: "timed",
  button: "I",
  text: "Quake raises crimson pillars under the foe it shakes.",
  levels: LEVELS,
  evolution: {
    partner: "br_fault",
    name: "Aftershock",
    text: "Quake strikes again half a second later where it struck.",
    row: evolvedRow(LEVELS[7], "Quake strikes again after 0.5 s.", {
      ...drillValues({ again: 1 }),
      again: 1,
      third: 2,
    }),
  },
};
