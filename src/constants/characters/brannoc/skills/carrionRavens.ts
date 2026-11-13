import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "40%: two ravens strike the foe that hurt him, 0.6x.",
    values: { chance: 0.4, count: 2, power: 0.6, blind: 0, repay: 0, storm: 0 },
  },
  { text: "They blind it 1 s.", values: { blind: 1 } },
  { text: "0.9x.", values: { power: 0.9 } },
  { text: "Four ravens.", values: { count: 4 } },
  { text: "60% chance.", values: { chance: 0.6 } },
  { text: "1.2x.", values: { power: 1.2 } },
  { text: "Each strike repays 2% of max HP.", values: { repay: 0.02 } },
  { text: "1.6x.", values: { power: 1.6 } },
]);

/** Carrion Ravens. Design: docs/skills/brannoc.md. Values: chance: chance a blow taken sends them; count: ravens; power: attack damage each raven deals; blind: seconds they stagger the foe; repay: share of max HP each raven's strike repays; storm: seconds a raven cloud circles him (evolution) */
export const CARRION_RAVENS: SkillDef = {
  id: "b_ravens",
  name: "Carrion Ravens",
  kind: "summon",
  risk: "timed",
  button: "auto",
  text: "A blow taken may send ravens at the foe that dealt it.",
  levels: LEVELS,
  evolution: {
    partner: "b_axeThrow",
    name: "Carrion Storm",
    text: "A cloud of ravens circles him for 4 s, striking every foe it passes.",
    row: evolvedRow(LEVELS[7], "A raven cloud circles him for 4 s.", { storm: 4 }),
  },
};
