import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `bonus` added damage of a Keen blow on the foe it pays off on, `window` the Keen beat in seconds, `hold`
 *  seconds a Keen move holds the foe it paid off on, `reach` px a Keen thrust reaches farther, `streak` added per Keen move in a row up to
 *  `streakCap`, `twin` power share of the second strike of a Keen lunge; evolved `star` AD of the rose star every
 *  `starEvery` Keen moves in a row, which gives `starPoints` */
const LEVELS = levelRows([
  { text: "Keen blows deal +150% damage.", values: { bonus: 1.5, window: 0.1 } },
  { text: "Keen beat 0.10 to 0.15 s.", values: { window: 0.15 } },
  { text: "New: a Keen blow holds its foe in place for 0.4 s.", values: { hold: 0.4 } },
  { text: "New: Keen thrusts reach 16 px farther.", values: { reach: 16 } },
  { text: "Keen damage +150% to +400%.", values: { bonus: 4 } },
  { text: "New: each Keen blow in a row adds +25% to the next, up to +100%.", values: { streak: 0.25, streakCap: 1 } },
  { text: "New: a Keen lunge strikes twice.", values: { twin: 1 } },
  { text: "Keen damage +400% to +800%.", values: { bonus: 8 } },
]);

export const MEASURED_TOUCH: SkillDef = {
  id: "ce_measure",
  name: "Measured Touch",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "Press J in the beat after a thrust lands: the Keen blow hits far harder.",
  levels: LEVELS,
  evolution: {
    partner: "ce_riposte",
    name: "Perfect Measure",
    text: "Every fourth Keen blow in a row bursts a gold rose star on the foe and gives 2 Points.",
    row: evolvedRow(LEVELS[7], "Every 4th Keen blow in a row: a rose star and 2 Points.", {
      star: 90,
      starEvery: 4,
      starPoints: 2,
    }),
  },
};
