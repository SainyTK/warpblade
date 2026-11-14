import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `power` multiplies Shield fall's landing ring, `ring` share added to its reach, `valor` Valor for each foe the landing strikes, `barrier` the landing raises Bulwark, `ground` seconds of burning light it leaves, `dive` share added to its dive speed */
const LEVELS = levelRows([
  { text: "Shield fall's landing +30%, reaching 30% farther.", values: { power: 1.3, ring: 0.3 } },
  { text: "Landing +60%.", values: { power: 1.6 } },
  { text: "New: 6 Valor for each foe the landing strikes.", values: { valor: 6 } },
  { text: "New: the landing raises Bulwark.", values: { barrier: 1 } },
  { text: "Landing reaches 60% farther.", values: { ring: 0.6 } },
  { text: "New: the landing leaves burning light for 2 s.", values: { ground: 2 } },
  { text: "New: a faster dive.", values: { dive: 0.4 } },
  { text: "Landing +200%.", values: { power: 3 } },
]);

export const SKYFALL: SkillDef = {
  id: "al_skyfall",
  name: "Skyfall",
  kind: "movement",
  risk: "easy",
  button: "jump",
  text: "Shield fall hits harder and its ring reaches farther.",
  levels: LEVELS,
  evolution: {
    partner: "al_crest",
    name: "Falling Sun",
    text: "Shield fall brings a pillar of dawn down where he lands, and its ring reaches twice as far.",
    row: evolvedRow(LEVELS[7], "A pillar where he lands.", { ring: 1, pillar: 1 }),
  },
};
