import { SNARE } from "../../../../constants/sable/snare";
import { WIDE_COST } from "../../../../constants/spells";
import type { SableSpellId } from "../../../../types/sable";
import { emitSkillEvent } from "../../../skills/events";
import { skillLevel } from "../../../skills/query";
import { hero } from "../../../state";
import { setState, settle } from "../../actions";
import { cutForSharedAction, maySharedAct } from "../../sharedCut";
import { sable } from "../memory";
import { DECOY_SPELL } from "./decoy";
import { clearKegs, KEG_SPELL } from "./keg";
import { clearNets, NET_SPELL } from "./net";
import { SNARE_SPELL } from "./snare";
import type { SableSpell } from "./spell";

export const SPELLS: Readonly<Record<SableSpellId, SableSpell>> = {
  snare: SNARE_SPELL,
  s_net: NET_SPELL,
  s_decoy: DECOY_SPELL,
  s_keg: KEG_SPELL,
};
/** her spells in the order O turns through them, after the hop */
export const SPELL_ORDER: readonly SableSpellId[] = ["snare", "s_net", "s_decoy", "s_keg"];

/** the snare is in her base kit; the others come with their skills */
export const knowsSpell = (id: SableSpellId): boolean => id === "snare" || skillLevel(id) > 0;

/** MP a spell costs now, more for its wide form */
export const spellCost = (s: SableSpell, wide: boolean): number => s.mp() * (wide && s.wide ? WIDE_COST : 1);

/** every spell's recharge runs */
export function tickSpells(step: number): void {
  for (const id of SPELL_ORDER) {
    const s = SPELLS[id];
    if (s.left() > 0) s.spend(Math.max(0, s.left() - step));
  }
}

/**
 * I on a spell: she kneels and casts it, paid with MP; on the floor only, so a press in the air waits for her to land. A
 * long press casts its wide form when it has one and she can pay for it, the plain form otherwise.
 */
export function castSpell(id: SableSpellId, held: boolean): boolean {
  const h = hero;
  const spell = SPELLS[id];
  if (!h.ground || !spell.room() || !maySharedAct()) return false;
  const wide = held && !!spell.wide && h.mp >= spellCost(spell, true);
  cutForSharedAction();
  h.mp -= spellCost(spell, wide);
  spell.spend(spell.cooldown());
  sable.casting = id;
  sable.castWide = wide;
  h.running = false;
  setState("snare");
  emitSkillEvent({ type: "cast", ability: id });
  return true;
}

/** the spell goes off on the casting clip's set frame */
export function runCast(): void {
  const h = hero;
  if (!h.hitDone && h.st >= SNARE.set) {
    h.hitDone = true;
    const spell = SPELLS[sable.casting];
    if (sable.castWide && spell.wide) spell.wide();
    else spell.release();
  }
  if (h.st >= SNARE.dur) settle();
}

/** a new run: no kegs or nets left over */
export function resetSpells(): void {
  clearKegs();
  clearNets();
}
