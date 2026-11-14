import type { CharacterDef } from "../../types/character";
import { ALDRIC_ACHIEVEMENTS } from "./constants/achievements";
import { ALDRIC_CLIPS } from "./constants/clips";
import { ALDRIC_CONTROLS } from "./constants/controls";
import { DAWN_CSS } from "./constants/light";
import { ALDRIC_SKILL_DEFS } from "./constants/skills";
import { ALDRIC_SKIN } from "./look";

/**
 * Aldric, the dawn shield: a knight captain who attacks and advances from behind a raised shield. His data entry, read
 * by the roster; his code entry is `index.ts` beside it. Design: docs/heroes/aldric.md
 */
export const ALDRIC: CharacterDef = {
  id: "aldric",
  name: "Aldric",
  title: "The shield knight",
  blurb:
    "Walks into the fight behind a raised kite shield and bashes from behind it. Every blow he stops builds Valor, and full Valor lights his sword.",
  accent: DAWN_CSS,
  price: 300,
  special: { id: "sanctuary", name: "Sanctuary" },
  base: { ad: 10, ap: 9, hp: 120, mp: 90, stamina: 110, crit: 0.04, move: 0.95, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.3, mp: 0.4 },
  skills: ALDRIC_SKILL_DEFS,
  comboHits: 3,
  skin: ALDRIC_SKIN,
  clips: ALDRIC_CLIPS,
  controls: ALDRIC_CONTROLS,
  achievements: ALDRIC_ACHIEVEMENTS,
  sourceIcons: { attacks: "aldric_attacks", abilities: "aldric_abilities", ultimate: "aldric_ultimate" },
};
