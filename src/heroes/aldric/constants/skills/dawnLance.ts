import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { ABILITY_COST } from "../abilities";
import { drillValues, onDrill } from "./drillLevels";

/** values: `power` ability power of a lance, `pierce` foes one lance passes through, `recharge` seconds, `burn` ability power a burn stack deals a tick, `count` lances a cast throws, `burst` radius of a burst where a lance ends, `mark` extra damage a struck foe takes for 4 s */
const NATIVE = levelRows([
  { text: `Throw a lance of light (${ABILITY_COST.lance} MP).`, values: { power: 1.6, pierce: 1, recharge: 5 } },
  { text: "Lance power 1.6 to 2.", values: { power: 2 } },
  { text: "New: lances pass through 3 foes.", values: { pierce: 3 } },
  { text: "New: lances burn the foes they strike.", values: { burn: 0.2 } },
  { text: "Lance power 2.4; recharge 4 s.", values: { power: 2.4, recharge: 4 } },
  { text: "New: two lances a cast.", values: { count: 2 } },
  { text: "New: a lance bursts where it ends.", values: { burst: 26 } },
  { text: "Lance power 2.4 to 4.5.", values: { power: 4.5 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "Dawn Lance strikes 0.6 ability power harder.", drill: { extra: 0.6 } },
  { text: "New: the lance burns with light stacks.", drill: { burn: 0.15 } },
  { text: "New: the lance's mark doubles to +30%.", drill: { mark: 0.3 } },
  { text: "Lance 0.6 to 1.2 harder.", drill: { extra: 1.2 } },
  { text: "New: the lance bursts in a 30 px ring where it strikes.", drill: { burst: 0.6 } },
  { text: "Lance 1.2 to 2 harder.", drill: { extra: 2 } },
  { text: "New: two lances fly.", drill: { twin: 1 } },
  { text: "Lance 2 to 5 harder; the burst twice as hard.", drill: { extra: 5, burst: 1.2 } },
]);

export const DAWN_LANCE: SkillDef = {
  id: "al_lance",
  name: "Dawn Lance",
  kind: "spell",
  risk: "timed",
  button: "I",
  text: "Dawn Lance strikes harder, burns, marks deeper and bursts.",
  levels: LEVELS,
  evolution: {
    partner: "al_verdict",
    name: "Spear of Morning",
    text: "Every lance that strikes calls a sword of light down on its foe.",
    row: evolvedRow(LEVELS[7], "Each lance calls a sword of light.", {
      ...drillValues({ sword: 1 }),
      pierce: 99,
      mark: 0.25,
    }),
  },
};
