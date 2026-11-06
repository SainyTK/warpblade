import type { HeroKit } from "../../types/kit";
import { character } from "../state";
import { KAEL_KIT } from "./kael/kit";
import { SABLE_KIT } from "./sable/kit";
import { YSRA_KIT } from "./ysra/kit";

/** the kit of the hero being played; looked up on each call so module load order never matters */
export function kit(): HeroKit {
  switch (character.kit) {
    case "ysra":
      return YSRA_KIT;
    case "sable":
      return SABLE_KIT;
    default:
      return KAEL_KIT;
  }
}
