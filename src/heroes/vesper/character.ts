import type { CharacterDef } from "../../types/character";
import { VESPER_ACHIEVEMENTS } from "./constants/achievements";
import { VESPER_CLIPS } from "./constants/clips";
import { VESPER_CONTROLS } from "./constants/controls";
import { VESPER_SKILL_DEFS } from "./constants/skills/index";
import { VESPER_SKIN } from "./look";

/**
 * Vesper, the twin blade: a long blade for reach and a short blade for speed, a string that grows faster with every blow
 * that lands, and the longest air string of the nine. This is her data entry, read by the roster (src/heroes/roster.ts);
 * her code entry is `index.ts` beside it. Design: docs/heroes/vesper.md
 */
export const VESPER: CharacterDef = {
  id: "vesper",
  name: "Vesper",
  title: "The dusk wanderer",
  blurb:
    "A long blade for reach, a short one for speed. Every blow that lands quickens her, and she keeps foes in the air until the dusk takes them.",
  accent: "#b8a0ff",
  price: 400,
  special: { id: "duskWaltz", name: "Dusk Waltz" },
  base: { ad: 10, ap: 9, hp: 92, mp: 95, stamina: 100, crit: 0.06, move: 1.06, aspd: 1.05, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1, mp: 0.45 },
  skills: VESPER_SKILL_DEFS,
  comboHits: 4,
  skin: VESPER_SKIN,
  clips: VESPER_CLIPS,
  controls: VESPER_CONTROLS,
  achievements: VESPER_ACHIEVEMENTS,
  sourceIcons: { attacks: "vesper_attacks", abilities: "vesper_abilities", ultimate: "vesper_ultimate" },
};
