import type { HeroKit, KitId } from "../../types/kit";
import { character, shown } from "../state";
import { HULDA_KIT } from "./hulda/kit";
import { KAEL_KIT } from "./kael/kit";
import { MIREL_KIT } from "./mirel/kit";
import { ORRIN_KIT } from "./orrin/kit";
import { SABLE_KIT } from "./sable/kit";
import { WENNA_KIT } from "./wenna/kit";
import { YSRA_KIT } from "./ysra/kit";

/** the kit of the hero being played; looked up on each call so module load order never matters */
export function kit(): HeroKit {
  return kitOf(character.kit);
}

/** the kit of the hero drawn on the stage, which in the menus can be one only looked at on the hero screen */
export function shownKit(): HeroKit {
  return kitOf(shown.kit);
}

function kitOf(id: KitId): HeroKit {
  switch (id) {
    case "ysra":
      return YSRA_KIT;
    case "sable":
      return SABLE_KIT;
    case "hulda":
      return HULDA_KIT;
    case "orrin":
      return ORRIN_KIT;
    case "mirel":
      return MIREL_KIT;
    case "wenna":
      return WENNA_KIT;
    default:
      return KAEL_KIT;
  }
}
