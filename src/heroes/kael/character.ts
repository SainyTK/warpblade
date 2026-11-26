import type { CharacterDef } from "../../types/character";
import { KAEL_CLIPS } from "./constants/clips";
import { KAEL_CONTROLS } from "./constants/controls";
import { KAEL_BASE_JOB, KAEL_JOBS } from "./constants/jobs";
import { KAEL_SKILL_DEFS } from "./constants/skills/index";
import { KAEL_SKIN } from "./look";

/**
 * Kael, the spell swordsman: the first hero, and the worked example of a hero module (docs/hero-module.md). This is
 * his data entry, read by the roster (src/heroes/roster.ts); his code entry is `index.ts` beside it.
 */
export const KAEL: CharacterDef = {
  id: "kael",
  name: "Kael",
  title: "The warp knight",
  blurb:
    "A spell swordsman. He throws his crystal sword, appears where it lands, and casts spells into his sword combo.",
  accent: "#7fe3ff",
  price: 0,
  special: { id: "crystalNova", name: "Crystal Nova" },
  base: { ad: 10, ap: 10, hp: 100, mp: 100, stamina: 100, crit: 0.05, move: 1, aspd: 1, haste: 1 },
  skills: KAEL_SKILL_DEFS,
  comboHits: 4,
  skin: KAEL_SKIN,
  clips: KAEL_CLIPS,
  controls: KAEL_CONTROLS,
  achievements: [],
  sourceIcons: { attacks: "kael_attacks", abilities: "kael_abilities", ultimate: "kael_ultimate" },
  baseJob: KAEL_BASE_JOB,
  jobs: KAEL_JOBS,
};
