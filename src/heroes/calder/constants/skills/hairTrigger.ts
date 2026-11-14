import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `bonus` added share of a Trigger's blast on the struck foe, `window` seconds after a blow lands that J is a Trigger, `guardBreak`, `stagger` seconds, `streak` added per Trigger in a row up to `streakCap`, `twin` a Trigger on Breaker fires a second round, `mark` damage taken for `markTime` seconds */
const LEVELS = levelRows([
  { text: "Trigger blasts deal +150% to the struck foe.", values: { bonus: 1.5, window: 0.1 } },
  { text: "Trigger window 0.10 to 0.14 s.", values: { window: 0.14 } },
  { text: "New: a Trigger blast breaks guards and staggers.", values: { guardBreak: 1, stagger: 0.6 } },
  { text: "Bonus +150% to +350%.", values: { bonus: 3.5 } },
  { text: "New: each Trigger in a row adds +50%, up to +200%.", values: { streak: 0.5, streakCap: 2 } },
  { text: "New: a Trigger on Breaker fires a second round.", values: { twin: 1 } },
  { text: "New: the struck foe takes +20% from everything for 3 s.", values: { mark: 0.2, markTime: 3 } },
  { text: "Bonus +350% to +1200%.", values: { bonus: 12 } },
]);

export const HAIR_TRIGGER: SkillDef = {
  id: "ca_trigger",
  name: "Hair Trigger",
  kind: "attack",
  risk: "precise",
  button: "J",
  text: "A Trigger's round hits far harder on the foe the blow struck.",
  levels: LEVELS,
  evolution: {
    partner: "ca_speedload",
    name: "Dead Center",
    text: "A Trigger gives its round back, and every third Trigger in a row sends a breaching slug through the foe.",
    row: evolvedRow(LEVELS[7], "A Trigger gives its round back; every third, a breaching slug.", {
      refund: 1,
      breachEvery: 3,
      breach: 25,
    }),
  },
};
