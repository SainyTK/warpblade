import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

const LEVELS = levelRows([
  {
    text: "Gloam holds 20 more and refills 25% faster.",
    values: { max: 20, refill: 0.25, cost: 0, trickle: 0, drain: 0, endless: 0 },
  },
  { text: "The Veil costs 5 less.", values: { cost: 5 } },
  { text: "1 Gloam a second even while seen.", values: { trickle: 1 } },
  { text: "The Veil drains 20% less.", values: { drain: 0.2 } },
  { text: "Crit +3%.", values: {}, stats: { crit: 0.03 } },
  { text: "Gloam refills 40% faster.", values: { refill: 0.4 }, stats: { crit: 0.03 } },
  { text: "Gloam holds 30 more.", values: { max: 30 }, stats: { crit: 0.03 } },
  { text: "Gloam refills 60% faster.", values: { refill: 0.6 }, stats: { crit: 0.03 } },
]);

/** Shroud. Design: docs/skills/tallis.md. Values: max: Gloam the bar holds more; refill: share faster Gloam refills; cost: Gloam less to raise the Veil; trickle: Gloam a second even while seen; drain: share less the Veil drains; endless: 1 the Veil does not drain while he stands still (evolution) */
export const SHROUD: SkillDef = {
  id: "t_shroud",
  name: "Shroud",
  kind: "passive",
  risk: "easy",
  button: "auto",
  text: "More Gloam, faster refills and a cheaper Veil.",
  levels: LEVELS,
  evolution: {
    partner: "t_quietStep",
    name: "Endless Night",
    text: "The Veil does not drain while he stands still.",
    row: evolvedRow(LEVELS[7], "The Veil holds while he stands still.", { endless: 1 }),
  },
};
