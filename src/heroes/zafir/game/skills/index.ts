import { nativeOrDrill } from "../../../../drill";
import type { SkillBehavior } from "../../../../types/skillBehavior";
import { deepWounds } from "./deepWounds";
import { desertHawk } from "./desertHawk";
import { desertThirst } from "./desertThirst";
import { duneWalk } from "./duneWalk";
import { mirageDancer } from "./mirageDancer";
import { openedVeins } from "./openedVeins";
import { sandSlip } from "./sandSlip";
import { sandWraith } from "./sandWraith";
import { scouringSand } from "./scouringSand";

/** the code of each of Zafir's skills that acts on its own or answers events, by skill id; the rest live in his kit */
export const ZAFIR_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  za_veins: openedVeins,
  za_dune: duneWalk,
  za_slip: nativeOrDrill(sandSlip),
  za_deep: deepWounds,
  za_scour: scouringSand,
  za_thirst: desertThirst,
  za_wraith: sandWraith,
  za_mirage: mirageDancer,
  za_hawk: desertHawk,
};
