import { OVERHEAT } from "../../../../constants/ysra/heat";
import { clearBrazier } from "../../../spells/rites/brazier";
import type { YsraPart } from "../part";
import { listenAshenWake, resetAshenWake } from "./ashenWake";
import { listenFusions } from "./fusion";
import { burnGlaive } from "./glaiveFire";
import { overheatLeft, resetHeat, tickHeat } from "./heat";
import { runRite } from "./rite";
import { resetRiteChoice, selectNextRite } from "./riteChoice";
import { listenStrikes } from "./strikeHeat";

export { heat } from "./heat";
export { pressRite } from "./rite";

listenStrikes();
listenAshenWake();
listenFusions();

/** O: select the next learned rite */
export function cycleRite(): boolean {
  return selectNextRite();
}

/** Heat and the rites it pays for: Heat ticks and drains, the rite pose plays, Overheat speeds the glaive */
export const PYRE_PART: YsraPart = {
  tick: (dt) => {
    tickHeat(dt);
    burnGlaive();
  },
  runState: () => runRite(),
  attackRate: () => (overheatLeft() > 0 ? OVERHEAT.attackRate : 1),
  reset: () => {
    resetHeat();
    resetRiteChoice();
    resetAshenWake();
    clearBrazier();
  },
};
