import type { CharacterDef } from "../../types/character";
import { ZAFIR_ACHIEVEMENTS } from "./constants/achievements";
import { ZAFIR_CLIPS } from "./constants/clips";
import { ZAFIR_CONTROLS } from "./constants/controls";
import { ZAFIR_ACCENT } from "./constants/palette";
import { ZAFIR_SKILL_DEFS } from "./constants/skills";
import { ZAFIR_SKIN } from "./look";

/**
 * Zafir, the dervish: a desert blade dancer with a broad scimitar. His data entry, read by the roster
 * (src/heroes/roster.ts); his code entry is `index.ts` beside it. Design: docs/heroes/zafir.md.
 */
export const ZAFIR: CharacterDef = {
  id: "zafir",
  name: "Zafir",
  title: "The dervish",
  blurb:
    "Never stops moving. He walks through his spins, cuts both sides at once, leaves bleeding wounds and turns a ring of sand round himself.",
  accent: ZAFIR_ACCENT,
  price: 1350,
  special: { id: "sandstorm", name: "Sandstorm" },
  base: { ad: 10, ap: 9, hp: 105, mp: 90, stamina: 100, crit: 0.05, move: 1.05, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.15, mp: 0.4 },
  skills: ZAFIR_SKILL_DEFS,
  comboHits: 4,
  skin: ZAFIR_SKIN,
  clips: ZAFIR_CLIPS,
  controls: ZAFIR_CONTROLS,
  achievements: ZAFIR_ACHIEVEMENTS,
  sourceIcons: { attacks: "zafir_attacks", abilities: "zafir_abilities", ultimate: "zafir_ultimate" },
};
