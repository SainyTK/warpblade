import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `cost` share off a block's stamina, `walk` share of his walk added to the guard walk, `heal` HP a block gives back, `reach` share added to the Guard bash's reach, `bashRate` share off the Guard bash's wait, `regen` stamina a second while the guard is up, `lance` attack damage of a lance of light a block throws back */
const LEVELS = levelRows([
  { text: "Blocks cost 25% less; stamina +10.", values: { cost: 0.25 }, stats: { stamina: 10 } },
  { text: "A quicker guard walk.", values: { walk: 0.1 } },
  { text: "New: each block heals 1 HP.", values: { heal: 1 } },
  { text: "New: the Guard bash reaches 30% farther.", values: { reach: 0.3 } },
  { text: "Blocks cost half; stamina +25.", values: { cost: 0.5 }, stats: { stamina: 25 } },
  { text: "New: the Guard bash comes back 30% sooner.", values: { bashRate: 0.3 } },
  { text: "New: stamina comes back while the guard is up.", values: { regen: 15 } },
  { text: "A guard walk at 70% of your walk; stamina +40.", values: { walk: 0.25 }, stats: { stamina: 40 } },
]);

export const IRON_VOW: SkillDef = {
  id: "al_vow",
  name: "Iron Vow",
  kind: "passive",
  risk: "easy",
  button: "K",
  text: "Blocks cost less stamina, the guard walk is quicker, and you have more stamina.",
  levels: LEVELS,
  evolution: {
    partner: "al_retort",
    name: "Iron Fortress",
    text: "Every blow the shield stops throws a lance of light back at the attacker.",
    row: evolvedRow(LEVELS[7], "Blocks throw a lance back.", { lance: 1.5 }),
  },
};
