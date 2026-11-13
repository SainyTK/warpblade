import { SECOND_HAND, STOPPED_CLOCK } from "../../../constants/mirel/abilities";
import { STILLFIELD } from "../../../constants/mirel/field";
import type { AbilitySlot } from "../../../types/moveset";
import { skillEvolved, skillLevel, skillValues } from "../../skills/query";
import { hero } from "../../state";
import { mirel } from "./memory";
import { hasSand } from "./sand";
import { castSecondHand } from "./secondHand";
import { castSpell, type SpellId, WAIT } from "./spells/castSpell";
import { castField, fieldCost, fieldWait } from "./stillfield";
import { castStoppedClock, clockMp } from "./stoppedClock";

/** the Stillfield, paid in Sand: tapped it stands a while, held it stays while I is held */
const STILLFIELD_SLOT: AbilitySlot = {
  id: "stillfield",
  label: "STILL",
  known: () => true,
  wait: fieldWait,
  full: () => STILLFIELD.cooldown,
  affordable: () => hasSand(fieldCost()),
  cast: castField,
  cost: () => `${Math.round(fieldCost())} SD`,
};

/** Stopped Clock: the foe ahead stops dead; held, every foe round her for a shorter while */
const STOPPED_CLOCK_SLOT: AbilitySlot = {
  id: "stoppedClock",
  label: "STOP",
  known: () => true,
  wait: () => mirel.clockCd,
  full: () => STOPPED_CLOCK.cooldown,
  affordable: () => hero.mp >= clockMp(false),
  cast: castStoppedClock,
};

/** Second Hand: a clock hand flies ahead through foes */
const SECOND_HAND_SLOT: AbilitySlot = {
  id: "secondHand",
  label: "HAND",
  known: () => true,
  wait: () => mirel.handCd,
  full: () => SECOND_HAND.cooldown,
  affordable: () => hero.mp >= SECOND_HAND.mp,
  cast: castSecondHand,
};

/** a spell skill on I, once she holds it */
const spellSlot = (id: SpellId, label: string): AbilitySlot => ({
  id,
  label,
  known: () => skillLevel(id) > 0,
  wait: () => mirel[WAIT[id]],
  full: () => Math.max(0.01, skillValues(id).cooldown ?? 1),
  affordable: () => hero.mp >= (skillValues(id).mp ?? 0),
  cast: () => castSpell(id),
  evolved: () => skillEvolved(id),
});

/** her abilities on I in the order O turns through them: her three from the start, then her spell skills */
export const MIREL_SLOTS: readonly AbilitySlot[] = [
  STILLFIELD_SLOT,
  STOPPED_CLOCK_SLOT,
  SECOND_HAND_SLOT,
  spellSlot("m_sundial", "DIAL"),
  spellSlot("m_foretell", "FORETELL"),
  spellSlot("m_handsweep", "HOUR"),
];

/** recharges run down */
export function tickAbilities(recharge: number): void {
  mirel.clockCd = Math.max(0, mirel.clockCd - recharge);
  mirel.handCd = Math.max(0, mirel.handCd - recharge);
  mirel.sundialCd = Math.max(0, mirel.sundialCd - recharge);
  mirel.foretellCd = Math.max(0, mirel.foretellCd - recharge);
  mirel.sweepCd = Math.max(0, mirel.sweepCd - recharge);
}
