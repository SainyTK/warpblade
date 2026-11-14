import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { SKILL } from "./ids";

/** values: `store` the factor on what the falling draw stores, `ring` attack damage of the ring its landing sends
 *  `ringReach` px along the floor, `air` falling draws added per airtime, `airCrit` it is a sure crit on foes in the air,
 *  `lift` its landing throws foes near her up this fast */
const LEVELS = levelRows([
  { text: "The falling draw stores +50%.", values: { store: 1.5 } },
  { text: "New: its landing sends a ring along the floor.", values: { ring: 0.8, ringReach: 34 } },
  { text: "Store +50% to +100%.", values: { store: 2 } },
  { text: "New: a second falling draw in the same airtime.", values: { air: 1 } },
  { text: "Ring 0.8 to 2 attack damage, wider.", values: { ring: 2, ringReach: 46 } },
  { text: "New: the falling draw is a sure critical hit on foes in the air.", values: { airCrit: 1 } },
  { text: "Store +100% to +200%.", values: { store: 3 } },
  { text: "New: the landing throws the foes near her up.", values: { lift: 220 } },
]);

export const FALLING_MOON: SkillDef = {
  id: SKILL.falling,
  name: "Falling Moon",
  kind: "attack",
  risk: "timed",
  button: "jump",
  text: "The falling draw stores more, and its landing cuts along the floor.",
  levels: LEVELS,
  evolution: {
    partner: SKILL.pass,
    name: "Moonfall",
    text: "The landing's ring and release reach every foe within 60 px, and the ring hits three times as hard.",
    row: evolvedRow(LEVELS[7], "The landing ring reaches 60 px and hits three times as hard.", {
      ring: 6,
      ringReach: 60,
    }),
  },
};
