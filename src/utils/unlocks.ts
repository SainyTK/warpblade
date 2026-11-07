import { CHARMS } from "../constants/charms";
import { RELICS } from "../constants/relics";
import { STARTING_CHARMS, STARTING_RELICS, STARTING_SLOTS, UNLOCKS } from "../constants/unlocks";
import type { GoalSource } from "../types/achievement";
import type { CharmId, RelicId } from "../types/build";
import type { Discovery, SlotNumber, Unlock, UnlockTarget } from "../types/unlock";
import { isMet } from "./achievements";

/** unlocks whose goal is met but that are not found yet */
export const newlyFound = (found: ReadonlySet<string>, src: GoalSource): Unlock[] =>
  UNLOCKS.filter((u) => !found.has(u.id) && isMet(u, src));

const foundTarget = (found: ReadonlySet<string>, match: (t: UnlockTarget) => boolean): boolean =>
  UNLOCKS.some((u) => match(u.target) && found.has(u.id));

/** a relic a new player starts with, or one found */
export const relicOpen = (id: RelicId, found: ReadonlySet<string>): boolean =>
  STARTING_RELICS.includes(id) || foundTarget(found, (t) => t.type === "relic" && t.id === id);

/** a charm a new player starts with, or one found */
export const charmOpen = (id: CharmId, found: ReadonlySet<string>): boolean =>
  STARTING_CHARMS.includes(id) || foundTarget(found, (t) => t.type === "charm" && t.id === id);

/** the starting slots of a kind and one more for each slot unlock found */
export const slotCount = (slot: "relic" | "charm", found: ReadonlySet<string>): number =>
  STARTING_SLOTS[slot] +
  UNLOCKS.filter((u) => u.target.type === "slot" && u.target.slot === slot && found.has(u.id)).length;

const ORDINALS: Readonly<Record<SlotNumber, string>> = { 4: "Fourth", 5: "Fifth" };

/** the name an unlock shows once found: the relic's, the charm's, or the slot's */
export function unlockName(t: UnlockTarget): string {
  if (t.type === "relic") return RELICS[t.id].name;
  if (t.type === "charm") return CHARMS[t.id].name;
  return `${ORDINALS[t.number]} ${t.slot} slot`;
}

/** what an unlock does once found: the relic's or charm's card text, or what the slot holds */
export function unlockText(t: UnlockTarget): string {
  if (t.type === "relic") return RELICS[t.id].text;
  if (t.type === "charm") return CHARMS[t.id].text;
  return `Carry ${t.number} ${t.slot}s in a run.`;
}

/** the name of a discovery for the toast and the end of run list */
export const discoveryName = (d: Discovery): string =>
  d.type === "unlock" ? unlockName(d.unlock.target) : RELICS[d.relic].evolution.name;

/** the unlock that opens a relic or a charm; none for one a new player starts with */
export const unlockOf = (type: "relic" | "charm", id: RelicId | CharmId): Unlock | undefined =>
  UNLOCKS.find((u) => u.target.type === type && u.target.id === id);

/** the slot unlocks, fourth before fifth, relics before charms */
export const slotUnlocks = (): readonly Unlock[] => UNLOCKS.filter((u) => u.target.type === "slot");
