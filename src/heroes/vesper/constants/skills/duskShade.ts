import type { SkillDef } from "../../../../types/skill";
import { evolvedRow, levelRows } from "../../../../utils/skillRows";

/** values: `chance` a blow calls a shade, `power` attack damage of its cut, `cooldown` least seconds between shades,
 *  `line` it cuts every foe on its line, `back` it turns back once, `pair` shades come from both sides */
const LEVELS = levelRows([
  {
    text: "A blow may call a dusk shade that dashes through its foe.",
    values: { chance: 0.15, power: 1, cooldown: 0.8 },
  },
  { text: "Chance 15% to 25%.", values: { chance: 0.25 } },
  { text: "New: the shade cuts every foe on its line.", values: { line: 1 } },
  { text: "Cut 1 to 1.5.", values: { power: 1.5 } },
  { text: "New: the shade turns and dashes back.", values: { back: 1 } },
  { text: "Chance 35%; a shade every 0.6 s at most.", values: { chance: 0.35, cooldown: 0.6 } },
  { text: "New: shades come in pairs, one from each side.", values: { pair: 1 } },
  { text: "Cut 1.5 to 2.2.", values: { power: 2.2 } },
]);

export const DUSK_SHADE: SkillDef = {
  id: "ve_shade",
  name: "Dusk Shade",
  kind: "summon",
  element: "void",
  risk: "easy",
  button: "auto",
  text: "Your blows may call a shade of you that dashes through the foe.",
  levels: LEVELS,
  evolution: {
    partner: "ve_storm",
    name: "Shade Troupe",
    text: "At the top of Tempo every blow calls a shade, as often as its wait allows.",
    row: evolvedRow(LEVELS[7], "At the top of Tempo every blow calls a shade.", {}),
  },
};
