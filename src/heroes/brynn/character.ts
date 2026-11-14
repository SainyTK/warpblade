import type { CharacterDef } from "../../types/character";
import { BRYNN_CLIPS } from "./constants/clips";
import { BRYNN_ACCENT } from "./constants/colors";
import { BRYNN_CONTROLS } from "./constants/controls";
import { BRYNN_SKILL_DEFS } from "./constants/skills";
import { BRYNN_SKIN } from "./look";

/**
 * Brynn, the heavy blade (docs/heroes/brynn.md): her data entry, read by the roster. Her code entry is `index.ts`
 * beside it.
 */
export const BRYNN: CharacterDef = {
  id: "brynn",
  name: "Brynn",
  title: "The heavy blade",
  blurb:
    "Small, loud, and carrying a sword as tall as she is. Her swings do not stop for anything, sweep a crowd off its feet and end in a slam that shakes the floor.",
  accent: BRYNN_ACCENT,
  price: 1000,
  special: { id: "crimsonFall", name: "Crimson Fall" },
  base: { ad: 12, ap: 9, hp: 115, mp: 90, stamina: 110, crit: 0.05, move: 0.94, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.3, mp: 0.4 },
  skills: BRYNN_SKILL_DEFS,
  comboHits: 3,
  skin: BRYNN_SKIN,
  clips: BRYNN_CLIPS,
  controls: BRYNN_CONTROLS,
  achievements: [],
  sourceIcons: { attacks: "brynn_attacks", abilities: "brynn_abilities", ultimate: "brynn_ultimate" },
};
