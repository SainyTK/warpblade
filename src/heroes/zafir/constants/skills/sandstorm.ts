import { ULT_CHARGE } from "../../../../constants/ultimate";
import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: each a multiple of the storm's own: `power` its cuts, `cooldown` seconds, `charge` charging speed, `time` how long it lasts (its cuts keep their strength), `grains` its look, `blind` minions in it cannot see him, `wounds` more wounds a cut opens, `reach` its reach, `twin` evolved, a second storm this hard turns round the first */
const LEVELS = levelRows([
  { text: "The storm cuts 30% harder.", values: { power: 1.3 } },
  { text: "Recharge 20 to 15 s; charges 30% faster.", values: { cooldown: 15, charge: 1.3 } },
  { text: "New: the storm lasts half again as long.", values: { time: 1.5, grains: 1.5 } },
  { text: "New: minions inside it cannot see you.", values: { blind: 1 } },
  { text: "Storm power +30% to +90%.", values: { power: 1.9 } },
  { text: "New: each cut opens two wounds.", values: { wounds: 1 } },
  { text: "New: the storm reaches 40% farther.", values: { reach: 1.4 } },
  { text: "Storm power +90% to +300%.", values: { power: 4 } },
]);

export const SANDSTORM: SkillDef = {
  id: "za_storm",
  name: "Sandstorm",
  kind: "ultimate",
  risk: "easy",
  button: "U",
  text: `Sandstorm grows: it cuts harder, lasts longer, blinds minions, opens more wounds and reaches farther. Grows with attack damage. ${ULT_CHARGE}`,
  levels: LEVELS,
  evolution: {
    partner: "za_whirling",
    name: "Endless Sirocco",
    text: "A second, wider storm turns round the first, and the storm lasts twice as long.",
    row: evolvedRow(LEVELS[7], "A second, wider storm; twice as long.", { twin: 1, time: 2 }),
  },
};
