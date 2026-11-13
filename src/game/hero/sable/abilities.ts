import type { AbilitySlot } from "../../../types/moveset";
import type { SableSpellId } from "../../../types/sable";
import { skillEvolved } from "../../skills/query";
import { hero } from "../../state";
import { castHop, hopWait } from "./evade";
import { sable } from "./memory";
import { castSpell, knowsSpell, SPELL_ORDER, SPELLS, spellCost } from "./spells/cast";

/** the hop back with its shot: in her base kit, free, on its own recharge; held, the slide forward */
const HOP_SLOT: AbilitySlot = {
  id: "hop",
  label: "HOP",
  known: () => true,
  wait: hopWait,
  full: () => sable.hopFull,
  affordable: () => true,
  cast: castHop,
  evolved: () => skillEvolved("s_hopVolley"),
};

/** one of her spells on I: the snare from the start, the others with their skills */
const spellSlot = (id: SableSpellId): AbilitySlot => {
  const spell = SPELLS[id];
  return {
    id,
    label: spell.label,
    tint: spell.tint,
    known: () => knowsSpell(id),
    wait: spell.left,
    full: () => Math.max(0.01, spell.cooldown()),
    affordable: () => hero.mp >= spellCost(spell, false) && spell.room(),
    cast: (wide) => castSpell(id, wide),
    evolved: () => skillEvolved(id === "snare" ? "s_barbed" : id),
  };
};

/** Sable's abilities on I, in the order O turns through them: the hop, then the snare and her spell skills */
export const SABLE_SLOTS: readonly AbilitySlot[] = [HOP_SLOT, ...SPELL_ORDER.map(spellSlot)];
