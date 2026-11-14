import type { CharacterDef } from "../../types/character";
import { SAYA_ACHIEVEMENTS } from "./constants/achievements";
import { SAYA_CLIPS } from "./constants/clips";
import { SAYA_CONTROLS } from "./constants/controls";
import { SAYA_SKILL_DEFS } from "./constants/skills/index";
import { SAYA_SKIN } from "./look";

/**
 * Saya, the quickdraw: a katana kept in its scabbard, cuts stored in the foe and released when the blade clicks home.
 * This is her data entry, read by the roster (src/heroes/roster.ts); her code entry is `index.ts` beside it.
 * Design: docs/heroes/saya.md.
 */
export const SAYA: CharacterDef = {
  id: "saya",
  name: "Saya",
  title: "The quickdraw",
  blurb:
    "Her katana rests in its scabbard until it is needed. Every cut waits in the foe, and all of them land at once when the blade clicks home.",
  accent: "#8fa2ff",
  price: 550,
  special: { id: "silentMoon", name: "Silent Moon" },
  base: { ad: 11, ap: 8, hp: 95, mp: 90, stamina: 100, crit: 0.08, move: 1.04, aspd: 1, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1, mp: 0.4 },
  skills: SAYA_SKILL_DEFS,
  comboHits: 3,
  skin: SAYA_SKIN,
  clips: SAYA_CLIPS,
  controls: SAYA_CONTROLS,
  achievements: SAYA_ACHIEVEMENTS,
  sourceIcons: { attacks: "saya_attacks", abilities: "saya_abilities", ultimate: "saya_ultimate" },
};
