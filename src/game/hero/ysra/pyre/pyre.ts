import { HEAT } from "../../../../constants/ysra/heat";
import { FLARE } from "../../../../constants/ysra/rites";
import { skillValues } from "../../../skills/query";
import { clearBrazier } from "../../../spells/rites/brazier";
import { castFlare } from "../../../spells/rites/flare";
import { game, hero } from "../../../state";
import { buffs } from "../buffs";
import type { YsraPart } from "../part";
import { listenAshenWake, resetAshenWake } from "./ashenWake";
import { burnGlaive } from "./glaiveFire";
import { listenGuard } from "./guardHeat";
import { heat, nearDeath, overheatLeft, resetHeat, tickHeat } from "./heat";
import { runRite } from "./rite";
import { resetRiteChoice, selectNextRite } from "./riteChoice";
import { listenStrikes } from "./strikeHeat";

export { heat } from "./heat";
export { pressRite } from "./rite";

/** Overheat's nova reaches this far around her */
const NOVA_RADIUS = 60;

listenStrikes();
listenAshenWake();
listenGuard();

/** O: select the next known rite */
export function cycleRite(): boolean {
  return selectNextRite();
}

/** Overheat ran out: its nova bursts around her */
function nova(): void {
  const power = skillValues("y_overheat").nova ?? 0;
  if (power) game.fx.push(castFlare(hero.x, hero.y, { ...FLARE, radius: NOVA_RADIUS, power }, "abilities"));
}

/** Heat and the rites it pays for: Heat ticks and drains, the rite pose plays, Overheat speeds and lengthens the glaive,
 *  a full bar empowers her blows (Kindling) */
export const PYRE_PART: YsraPart = {
  tick: (dt) => {
    if (tickHeat(dt)) nova();
    const hot = overheatLeft() > 0;
    buffs.reach = hot ? (skillValues("y_overheat").reach ?? 0) : 0;
    buffs.full = heat() >= HEAT.max && !hot ? (skillValues("y_kindling").full ?? 0) : 0;
    burnGlaive();
  },
  runState: () => runRite(),
  attackRate: () => (overheatLeft() > 0 ? (skillValues("y_overheat").rate ?? 1) : 1),
  hurtScale: () => (nearDeath() ? 1 - skillValues("y_kindling").low : 1),
  reset: () => {
    resetHeat();
    resetRiteChoice();
    resetAshenWake();
    clearBrazier();
  },
};
