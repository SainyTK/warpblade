import type { CharacterDef } from "../../types/character";
import { CERISE_ACHIEVEMENTS } from "./constants/achievements";
import { CERISE_CLIPS } from "./constants/clips";
import { CERISE_CONTROLS } from "./constants/controls";
import { CERISE_SKILL_DEFS } from "./constants/skills/index";
import { CERISE_SKIN } from "./look";

/** Cerise, the rose duelist: her data entry, read by the roster (src/heroes/roster.ts); her code entry is `index.ts` */
export const CERISE: CharacterDef = {
  id: "cerise",
  name: "Cerise",
  title: "The rose duelist",
  blurb:
    "A young duelist with a rapier and a long reach. Quick thrusts on a thin line, a parry that answers at once, and ripostes that keep coming on the beat.",
  accent: "#ff8fb0",
  price: 0,
  special: { id: "roseTempest", name: "Rose Tempest" },
  base: { ad: 10, ap: 9, hp: 92, mp: 100, stamina: 100, crit: 0.08, move: 1.04, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1, mp: 0.45 },
  skills: CERISE_SKILL_DEFS,
  comboHits: 5,
  skin: CERISE_SKIN,
  clips: CERISE_CLIPS,
  controls: CERISE_CONTROLS,
  achievements: CERISE_ACHIEVEMENTS,
  sourceIcons: { attacks: "cerise_attacks", abilities: "cerise_abilities", ultimate: "cerise_ultimate" },
};
