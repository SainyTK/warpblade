import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `damage` attack damage a sigil deals each tick (every 0.5 s), `max` sigils on a foe, `duration` seconds,
 *  `long` long blows lay them too, `spread` a fallen foe's sigils jump on, `taken` a foe with five takes this much more,
 *  `bloom` (evolved) attack damage of each sigil the moonrise blooms */
const LEVELS = levelRows([
  {
    text: "Short-blade blows lay a dusk sigil that cuts the foe as it burns.",
    values: { damage: 0.06, max: 3, duration: 3 },
  },
  { text: "Sigils 0.06 to 0.1.", values: { damage: 0.1 } },
  { text: "New: long-blade blows lay sigils too.", values: { long: 1 } },
  { text: "Up to 5 sigils on a foe.", values: { max: 5 } },
  { text: "New: a fallen foe's sigils jump to the nearest foe.", values: { spread: 1 } },
  { text: "Sigils 0.1 to 0.16; they last 4 s.", values: { damage: 0.16, duration: 4 } },
  { text: "New: a foe with 5 sigils takes 15% more from you.", values: { taken: 0.15 } },
  { text: "Sigils 0.16 to 0.24; up to 6.", values: { damage: 0.24, max: 6 } },
]);

export const DUSK_SIGIL: SkillDef = {
  id: "ve_hex",
  name: "Dusk Sigil",
  kind: "dot",
  risk: "easy",
  button: "auto",
  text: "Your short blade lays dusk sigils that keep cutting the foe.",
  levels: LEVELS,
  evolution: {
    partner: "ve_moon",
    name: "Sigil Bloom",
    text: "The moonrise blooms every sigil on the foes it strikes, each a blow of 1 times attack damage at once.",
    row: evolvedRow(LEVELS[7], "The moonrise blooms every sigil at once.", { bloom: 1 }),
  },
};
