import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `keen` added damage share of a Keen spin on the foe its payoff lands on, `wave` attack damage of the hot gust a Keen spin sends after that foe, `window` the Keen window in seconds, `streak` added share per Keen spin in a row up to `streakCap`, `whirl` Whirl a Keen spin adds, `noon` attack damage of Desert Noon's ring every `noonEvery` Keen spins in a row */
const LEVELS = levelRows([
  { text: "A Keen spin deals 40% more to the foe it reaches first.", values: { keen: 0.4 } },
  { text: "Keen bonus 40% to 70%.", values: { keen: 0.7 } },
  { text: "New: a Keen spin sends a hot gust after that foe.", values: { wave: 0.8 } },
  { text: "New: the Keen window is half again as long.", values: { window: 0.15 } },
  { text: "New: each Keen spin in a row adds 15%, up to 60%.", values: { streak: 0.15, streakCap: 0.6 } },
  { text: "Keen bonus 70% to 150%; gust 0.8 to 1.6.", values: { keen: 1.5, wave: 1.6 } },
  { text: "New: a Keen spin adds 20 Whirl.", values: { whirl: 20 } },
  { text: "Keen bonus 150% to 300%; gust 1.6 to 3.", values: { keen: 3, wave: 3 } },
]);

export const SIROCCO_TIMING: SkillDef = {
  id: "za_sirocco",
  name: "Sirocco Timing",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "A Keen spin hits much harder on the foe it reaches first, then sends a hot gust after it.",
  levels: LEVELS,
  evolution: {
    partner: "za_mirage",
    name: "Desert Noon",
    text: "Every third Keen spin in a row calls a blazing ring of noon light on the foe it reached, for 12 times attack damage.",
    row: evolvedRow(LEVELS[7], "Every third Keen spin in a row: a noon ring for 12.", { noon: 12, noonEvery: 3 }),
  },
};
