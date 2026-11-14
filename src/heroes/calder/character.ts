import type { CharacterDef } from "../../types/character";
import { CALDER_CLIPS } from "./constants/clips";
import { ACCENT } from "./constants/colors";
import { CALDER_CONTROLS } from "./constants/controls";
import { CALDER_SKILL_DEFS } from "./constants/skills";
import { CALDER_SKIN } from "./look";

/**
 * Calder, the trigger blade: a drifter mechanic whose sword is built round a revolving chamber. His data entry, read by
 * the roster (src/heroes/roster.ts); his code entry is `index.ts` beside it.
 */
export const CALDER: CharacterDef = {
  id: "calder",
  name: "Calder",
  title: "The trigger blade",
  blurb:
    "A drifter who rebuilt a broken sword round a revolving chamber. He cuts, and as the blade bites he pulls the trigger. Six rounds, then a reload.",
  accent: ACCENT,
  price: 1800,
  special: { id: "cylinderBreak", name: "Cylinder Break" },
  base: { ad: 11, ap: 9, hp: 105, mp: 90, stamina: 100, crit: 0.05, move: 0.97, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.15, mp: 0.4 },
  skills: CALDER_SKILL_DEFS,
  comboHits: 3,
  skin: CALDER_SKIN,
  clips: CALDER_CLIPS,
  controls: CALDER_CONTROLS,
  achievements: [],
  sourceIcons: { attacks: "calder_attacks", abilities: "calder_abilities", ultimate: "calder_ultimate" },
};
