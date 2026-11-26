import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `ring` radius of the ring, `power` attack damage of the ring, `stun` seconds it knocks foes down, `valor` Valor Crest breaker adds when it lands, `echo` rings that follow it, `crest` multiplies Crest breaker itself */
const NATIVE = levelRows([
  { text: "Crest breaker sends a ring of light along the floor.", values: { ring: 30, power: 0.6 } },
  { text: "Ring power 0.6 to 0.9.", values: { power: 0.9 } },
  { text: "New: the ring knocks foes down.", values: { stun: 0.6 } },
  { text: "New: Crest breaker gives 8 Valor.", values: { valor: 8 } },
  { text: "Ring reaches 42 px.", values: { ring: 42 } },
  { text: "New: a second ring follows.", values: { echo: 1 } },
  { text: "New: Crest breaker itself +40%.", values: { crest: 1.4 } },
  { text: "Ring power 0.9 to 2.2; reaches 50 px.", values: { power: 2.2, ring: 50 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "Crest breaker +50%.", drill: { finisher: 0.5 } },
  { text: "New: Crest breaker knocks the foe down for 0.7 s.", drill: { stagger: 0.7 } },
  { text: "New: Crest breaker shakes the floor in a 30 px ring, 0.8 attack.", drill: { ring: 0.8, radius: 30 } },
  { text: "Crest breaker +50% to +100%.", drill: { finisher: 1 } },
  { text: "New: a pillar of light falls on the foe it strikes.", drill: { pillar: 1 } },
  { text: "Crest breaker +100% to +160%; the ring twice as hard.", drill: { finisher: 1.6, ring: 1.6 } },
  { text: "New: the ring reaches 50 px.", drill: { radius: 50 } },
  { text: "Crest breaker +160% to +350%; the pillar three times as hard.", drill: { finisher: 3.5, pillar: 3 } },
]);

export const CRESTFALL: SkillDef = {
  id: "al_crest",
  name: "Crestfall",
  kind: "attack",
  element: "blaze",
  risk: "timed",
  button: "J",
  text: "Crest breaker, the last blow of the chain, hits far harder, knocks down and shakes the floor.",
  levels: LEVELS,
  evolution: {
    partner: "al_skyfall",
    name: "Dawnbreak",
    text: "Crest breaker calls three pillars of light in a row ahead.",
    row: evolvedRow(LEVELS[7], "Three pillars in a row ahead.", {
      ...drillValues({ pillars: 3 }),
      ring: 80,
      echo: 2,
    }),
  },
};
