import type { SkillBehavior } from "../../../types/skillBehavior";
import { emberBrand } from "./brand";
import { sunHawk } from "./hawk";
import { impale } from "./impale";
import { overheat } from "./overheat";
import { salamander } from "./salamander";
import { searingEdge } from "./searing";
import { glaiveShade } from "./shade";
import { windmill } from "./windmill";

/** the code of each of Ysra's skills that acts on its own or answers events, by skill id; the rest live in her kit */
export const YSRA_SKILLS: Readonly<Record<string, SkillBehavior>> = {
  y_impale: impale,
  y_windmill: windmill,
  y_overheat: overheat,
  y_searing: searingEdge,
  y_brand: emberBrand,
  y_shade: glaiveShade,
  y_salamander: salamander,
  y_hawk: sunHawk,
};
