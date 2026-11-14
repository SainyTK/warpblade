import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `bonus` added damage of a heavy swing on the foe it pays off on, `window` seconds of the heavy beat, `wave`
 *  added crescent power (AD) and `waveReach` its added share of reach, `heft` added Heft a Keen blow gives, `streak`
 *  added bonus per heavy swing in a row up to `streakCap`, `halfFissure` a Keen slam is a fissure from half Heft,
 *  `heavyFissure` every heavy swing also sends a fissure at this share of its power */
const LEVELS = levelRows([
  { text: "Keen blows deal +150% to the foe they hit first.", values: { bonus: 1.5 } },
  { text: "The Keen beat lasts 0.14 to 0.18 s.", values: { window: 0.18 } },
  { text: "New: the crescent off a Keen blow flies farther and hits harder.", values: { wave: 0.6, waveReach: 0.5 } },
  { text: "New: a Keen blow gives 10 more Heft.", values: { heft: 10 } },
  { text: "Heavy bonus +150% to +350%.", values: { bonus: 3.5 } },
  {
    text: "New: each Keen blow in a row adds +30% to the next, up to +90%.",
    values: { streak: 0.3, streakCap: 0.9 },
  },
  { text: "New: a Keen slam is a fissure from half Heft.", values: { halfFissure: 1 } },
  { text: "Heavy bonus +350% to +2000%; the crescent hits far harder.", values: { bonus: 20, wave: 4 } },
]);

export const HEAVY_HANDS: SkillDef = {
  id: "br_heavy",
  name: "Heavy Hands",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Press J just after a blow lands: the Keen blow hits far harder.",
  levels: LEVELS,
  evolution: {
    partner: "br_slam",
    name: "Mountain Hands",
    text: "Every Keen blow also splits the floor with a fissure ahead of her.",
    row: evolvedRow(LEVELS[7], "Every Keen blow also sends a fissure.", { heavyFissure: 0.8, bonus: 30 }),
  },
};
