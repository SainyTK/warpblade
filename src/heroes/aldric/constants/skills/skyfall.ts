import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";
import { drillValues, onDrill } from "./drillLevels";

/** values: `power` multiplies Shield fall's landing ring, `ring` share added to its reach, `valor` Valor for each foe the landing strikes, `barrier` the landing raises Bulwark, `ground` seconds of burning light it leaves, `dive` share added to its dive speed */
const NATIVE = levelRows([
  { text: "Shield fall's landing +30%, reaching 30% farther.", values: { power: 1.3, ring: 0.3 } },
  { text: "Landing +60%.", values: { power: 1.6 } },
  { text: "New: 6 Valor for each foe the landing strikes.", values: { valor: 6 } },
  { text: "New: the landing raises Bulwark.", values: { barrier: 1 } },
  { text: "Landing reaches 60% farther.", values: { ring: 0.6 } },
  { text: "New: the landing leaves burning light for 2 s.", values: { ground: 2 } },
  { text: "New: a faster dive.", values: { dive: 0.4 } },
  { text: "Landing +200%.", values: { power: 3 } },
]);

const LEVELS = onDrill(NATIVE, [
  { text: "One more air slash.", drill: { airSlashes: 1 } },
  { text: "New: a wall kick strikes foes near the wall, 0.6 attack.", drill: { kick: 0.6 } },
  {
    text: "New: landing after a Sky cut slams the shield in a 30 px ring, 0.8 attack.",
    drill: { slam: 0.8, radius: 30 },
  },
  { text: "Slam 0.8 to 1.4.", drill: { slam: 1.4 } },
  { text: "New: one more air dash.", drill: { airDashes: 1 } },
  { text: "Slam 1.4 to 2.2, 40 px.", drill: { slam: 2.2, radius: 40 } },
  { text: "New: a third air slash.", drill: { airSlashes: 2 } },
  { text: "Slam 2.2 to 5.", drill: { slam: 5 } },
]);

export const SKYFALL: SkillDef = {
  id: "al_skyfall",
  name: "Skyfall",
  kind: "movement",
  element: "storm",
  risk: "easy",
  button: "jump",
  text: "More air slashes, a cutting wall kick, and a shield slam where you land.",
  levels: LEVELS,
  evolution: {
    partner: "al_crest",
    name: "Falling Sun",
    text: "The slam calls a pillar of light where you land.",
    row: evolvedRow(LEVELS[7], "The slam calls a pillar.", {
      ...drillValues({ pillar: 2 }),
      ring: 1,
      pillar: 1,
    }),
  },
};
