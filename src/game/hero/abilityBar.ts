import type { AbilitySlot } from "../../types/moveset";
import { objectMemory, rememberPerSeat } from "../seatMemory";
import { deny } from "./deny";
import { kit } from "./kits";

/**
 * I: the ability bar every hero shares. The kit lists its abilities (`HeroKit.abilities`); each has its own recharge and
 * none waits on another. I casts the selected one; when it is still recharging or cannot be paid for, I casts the next
 * ready one in order instead and selects it. O turns the selection by hand. A long press of I casts the wide form of
 * abilities that have one.
 */

/** the selected ability's place in the kit's list; each co-op seat keeps its own */
const choice = { index: 0 };
rememberPerSeat(objectMemory(choice));

const slots = (): readonly AbilitySlot[] => kit().abilities;
const ready = (s: AbilitySlot): boolean => s.known() && s.wait() <= 0 && s.affordable();

/** the selected ability, moved onto a known one when it is not; null when the hero knows none */
export function selectedSlot(): AbilitySlot | null {
  const list = slots();
  if (!list.length) return null;
  const at = list[choice.index % list.length];
  if (at?.known()) return at;
  cycleAbility();
  const now = list[choice.index % list.length];
  return now?.known() ? now : null;
}

/** O: move to the next ability the hero knows; true when the selection changed */
export function cycleAbility(): boolean {
  const list = slots();
  for (let step = 1; step <= list.length; step++) {
    const i = (choice.index + step) % list.length;
    if (!list[i].known()) continue;
    const moved = i !== choice.index;
    choice.index = i;
    return moved;
  }
  return false;
}

/** the selected ability, or when it is not ready the next ready one after it in order */
function readySlot(): AbilitySlot | null {
  const list = slots();
  const from = selectedSlot();
  if (!from) return null;
  if (ready(from)) return from;
  const start = list.indexOf(from);
  for (let step = 1; step < list.length; step++) {
    const i = (start + step) % list.length;
    if (!ready(list[i])) continue;
    choice.index = i;
    return list[i];
  }
  return null;
}

/** I pressed, or held to its long press (`wide`): cast the ready ability; with none ready the press is refused at once */
export function pressAbility(wide: boolean): boolean {
  const slot = readySlot();
  if (slot) return slot.cast(wide);
  const selected = selectedSlot();
  if (!selected) return true;
  deny(selected.wait() > 0 ? "cast" : "mp");
  return true;
}

/** a fresh run: back to the first ability */
export function resetAbilityBar(): void {
  choice.index = 0;
}
