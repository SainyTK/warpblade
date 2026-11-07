import type { SkillBehavior } from "../../../types/skillBehavior";
import { crystalFamiliar } from "./crystalFamiliar";
import { crystalSplinters } from "./crystalSplinters";
import { iceSpikes } from "./iceSpikes";
import { mirrorKnight } from "./mirrorKnight";
import { phantomEdge } from "./phantomEdge";
import { riftWound } from "./riftWound";
import { skybreaker } from "./skybreaker";
import { skyDance } from "./skyDance";
import { staticCharge } from "./staticCharge";

/** the code of each of Kael's skills that acts on its own or answers events, by skill id; the rest live in his kit */
export const KAEL_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  k_skyward: skybreaker,
  k_skydance: skyDance,
  k_frost: iceSpikes,
  k_splinters: crystalSplinters,
  k_rift: riftWound,
  k_static: staticCharge,
  k_echo: phantomEdge,
  k_familiar: crystalFamiliar,
  k_mirror: mirrorKnight,
};
