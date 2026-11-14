import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `ring` radius of the ring, `power` attack damage of the ring, `stun` seconds it knocks foes down, `valor` Valor Crest breaker adds when it lands, `echo` rings that follow it, `crest` multiplies Crest breaker itself */
const LEVELS = levelRows([
  { text: "Crest breaker sends a ring of light along the floor.", values: { ring: 30, power: 0.6 } },
  { text: "Ring power 0.6 to 0.9.", values: { power: 0.9 } },
  { text: "New: the ring knocks foes down.", values: { stun: 0.6 } },
  { text: "New: Crest breaker gives 8 Valor.", values: { valor: 8 } },
  { text: "Ring reaches 42 px.", values: { ring: 42 } },
  { text: "New: a second ring follows.", values: { echo: 1 } },
  { text: "New: Crest breaker itself +40%.", values: { crest: 1.4 } },
  { text: "Ring power 0.9 to 2.2; reaches 50 px.", values: { power: 2.2, ring: 50 } },
]);

export const CRESTFALL: SkillDef = {
  id: "al_crest",
  name: "Crestfall",
  kind: "attack",
  risk: "timed",
  button: "J",
  text: "Crest breaker sends a ring of light along the floor that knocks foes down.",
  levels: LEVELS,
  evolution: {
    partner: "al_skyfall",
    name: "Dawnbreak",
    text: "Crest breaker sends three rings across 80 px, each one knocking foes down.",
    row: evolvedRow(LEVELS[7], "Three rings across 80 px.", { ring: 80, echo: 2 }),
  },
};
