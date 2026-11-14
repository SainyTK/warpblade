import type { CharacterDef } from "../../types/character";
import { YUN_ACHIEVEMENTS } from "./constants/achievements";
import { YUN_CLIPS } from "./constants/clips";
import { YUN_CONTROLS } from "./constants/controls";
import { YUN_SKILL_DEFS } from "./constants/skills";
import { YUN_SKIN } from "./look";

/**
 * Yun, the sword sage: a flowing string, spirit swords that echo his blows at range, and abilities that send them out
 * (docs/heroes/yun.md). This is his data entry, read by the roster; his code entry is `index.ts` beside it.
 */
export const YUN: CharacterDef = {
  id: "yun",
  name: "Yun",
  title: "The sword sage",
  blurb:
    "A travelling sage with a straight jian. His cuts flow in circles, and spirit swords hover behind him to repeat every blow at range.",
  accent: "#5fd6a4",
  price: 750,
  special: { id: "jadeRain", name: "Jade Rain" },
  base: { ad: 10, ap: 11, hp: 95, mp: 100, stamina: 100, crit: 0.05, move: 1, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.05, mp: 0.45 },
  skills: YUN_SKILL_DEFS,
  comboHits: 4,
  skin: YUN_SKIN,
  clips: YUN_CLIPS,
  controls: YUN_CONTROLS,
  achievements: YUN_ACHIEVEMENTS,
  sourceIcons: { attacks: "yun_attacks", abilities: "yun_abilities", ultimate: "yun_ultimate" },
};
