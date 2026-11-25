import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, withDrill } from "./drillRows";

/** values: `bonus` added damage of a Keen blow on the foe it pays off on, `window` the Keen beat in seconds, `hold`
 *  seconds a Keen move holds the foe it paid off on, `reach` px a Keen thrust reaches farther, `streak` added per Keen move in a row up to
 *  `streakCap`, `twin` power share of the second strike of a Keen lunge; evolved `star` AD of the rose star every
 *  `starEvery` Keen moves in a row, which gives `starPoints` */
const NATIVE = levelRows([
  { text: "Keen blows deal +150% damage.", values: { bonus: 1.5, window: 0.1 } },
  { text: "Keen beat 0.10 to 0.15 s.", values: { window: 0.15 } },
  { text: "New: a Keen blow holds its foe in place for 0.4 s.", values: { hold: 0.4 } },
  { text: "New: Keen thrusts reach 16 px farther.", values: { reach: 16 } },
  { text: "Keen damage +150% to +400%.", values: { bonus: 4 } },
  { text: "New: each Keen blow in a row adds +25% to the next, up to +100%.", values: { streak: 0.25, streakCap: 1 } },
  { text: "New: a Keen lunge strikes twice.", values: { twin: 1 } },
  { text: "Keen damage +400% to +800%.", values: { bonus: 8 } },
]);

const LEVELS = withDrill(NATIVE, [
  { text: "The first thrust strikes again for 0.6 AD.", drill: { first: 0.6 } },
  { text: "New: that strike is a sure critical hit.", drill: { crit: 1 } },
  { text: "New: the first thrust holds its foe for 0.4 s.", drill: { hold: 0.4 } },
  { text: "Strike 0.6 to 1.2 AD.", drill: { first: 1.2 } },
  { text: "New: the first thrust sets the Rose mark.", drill: { mark: 1 } },
  { text: "Strike 1.2 to 2 AD.", drill: { first: 2 } },
  { text: "New: a second touch follows for 1 AD.", drill: { echo: 1 } },
  { text: "Strike 2 to 4 AD; second touch 2 AD.", drill: { first: 4, echo: 2 } },
]);

export const MEASURED_TOUCH: SkillDef = {
  id: "ce_measure",
  name: "Measured Touch",
  kind: "attack",
  element: "frost",
  risk: "precise",
  button: "J",
  text: "The first thrust of the chain is a measured touch that strikes again.",
  levels: LEVELS,
  evolution: {
    partner: "ce_riposte",
    name: "Perfect Measure",
    text: "Every first thrust that lands calls a glass rapier through the foe.",
    row: evolvedRow(LEVELS[7], "First thrust: a glass rapier, 4 AD.", {
      ...drillValues({ star: 4 }),
      star: 90,
      starEvery: 4,
      starPoints: 2,
    }),
  },
};
