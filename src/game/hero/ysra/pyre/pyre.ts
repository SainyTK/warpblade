import { DENY_FLASH } from "../../../../constants/combat";
import { HEAT } from "../../../../constants/ysra/heat";
import { FLARE, RITES } from "../../../../constants/ysra/rites";
import { objectMemory, rememberPerSeat } from "../../../seatMemory";
import { skillValues } from "../../../skills/query";
import { clearBrazier } from "../../../spells/rites/brazier";
import { castFlare } from "../../../spells/rites/flare";
import { game, hero } from "../../../state";
import { selectedSlot } from "../../abilityBar";
import { buffs } from "../buffs";
import type { YsraPart } from "../part";
import { listenAshenWake, resetAshenWake } from "./ashenWake";
import { burnGlaive } from "./glaiveFire";
import { listenGuard } from "./guardHeat";
import { flashHeat, heat, nearDeath, overheatLeft, resetHeat, tickHeat } from "./heat";
import { runRite } from "./rite";
import { listenStrikes } from "./strikeHeat";

export { castRite, riteAffordable } from "./rite";

/** Overheat's nova reaches this far around her */
const NOVA_RADIUS = 60;

listenStrikes();
listenAshenWake();
listenGuard();

/** the refused-press flash last seen, so a new refusal of a rite blinks the Heat bar */
const refused = { seen: 0 };
rememberPerSeat(objectMemory(refused, true));

/** I refused while a rite is selected: Heat could not pay for it, so the Heat bar blinks */
function watchRefusal(): void {
  const flash = hero.denied.mp;
  const rite = RITES.some((r) => r.id === selectedSlot()?.id);
  if (flash > refused.seen && rite) flashHeat(DENY_FLASH);
  refused.seen = flash;
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
    watchRefusal();
  },
  runState: () => runRite(),
  attackRate: () => (overheatLeft() > 0 ? (skillValues("y_overheat").rate ?? 1) : 1),
  hurtScale: () => (nearDeath() ? 1 - skillValues("y_kindling").low : 1),
  reset: () => {
    resetHeat();
    refused.seen = 0;
    resetAshenWake();
    clearBrazier();
  },
};
