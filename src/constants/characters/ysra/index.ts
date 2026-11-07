import type { CharacterDef } from "../../../types/character";
import { legacySkills } from "../legacySkills";
import { BASTION } from "./bastion";
import { FUSION } from "./fusion";
import { LANCE } from "./lance";
import { YSRA_SKIN } from "./look";
import { PYRE } from "./pyre";

/** Ysra, the ember lancer: the second character, built to play nothing like Kael */
export const YSRA: CharacterDef = {
  id: "ysra",
  kit: "ysra",
  name: "Ysra",
  title: "The ember lancer",
  blurb:
    "A flame-temple guard with a long glaive. She vaults over foes, braces against their blows and builds Heat with every hit to spend on fire rites. Slower and tougher than Kael.",
  accent: "#ff8a2a",
  special: "pyreWave",
  base: { ad: 13, ap: 7, hp: 130, mp: 80, stamina: 110, crit: 0.03, move: 1.1, aspd: 0.92, haste: 1 },
  growth: { ad: 0, ap: 0, hp: 1.5, mp: 0.35 },
  skills: legacySkills([...LANCE, ...BASTION, ...PYRE, ...FUSION]),
  comboHits: 3,
  skin: YSRA_SKIN,
};
