import type { ZafirAbility } from "../../types/abilities";
import { castGale } from "./gale";
import { castGlass } from "./glass";
import { castQuicksand } from "./quicksand";

/** one of the spells his skills teach leaves his hand */
export function castSpell(a: ZafirAbility, wide: boolean): void {
  if (a === "gale") castGale(wide);
  else if (a === "glass") castGlass(wide);
  else if (a === "quicksand") castQuicksand(wide);
}
