import { CHARMS } from "../constants/charms";
import { STARTING_CHARM_SLOTS, STARTING_CHARMS, UNLOCKS } from "../constants/unlocks";
import type { GoalSource } from "../types/achievement";
import type { CharmId } from "../types/build";
import type { Discovery, SlotNumber, Unlock, UnlockTarget } from "../types/unlock";
import { isMet } from "./achievements";
import { findSkill } from "./skills";

/** unlocks whose goal is met but that are not found yet */
export const newlyFound = (found: ReadonlySet<string>, src: GoalSource): Unlock[] =>
  UNLOCKS.filter((u) => !found.has(u.id) && isMet(u, src));

/** a charm a new player starts with, or one found */
export const charmOpen = (id: CharmId, found: ReadonlySet<string>): boolean =>
  STARTING_CHARMS.includes(id) ||
  UNLOCKS.some((u) => u.target.type === "charm" && u.target.id === id && found.has(u.id));

/** the starting charm slots and one more for each slot unlock found */
export const slotCount = (found: ReadonlySet<string>): number =>
  STARTING_CHARM_SLOTS + UNLOCKS.filter((u) => u.target.type === "slot" && found.has(u.id)).length;

const ORDINALS: Readonly<Record<SlotNumber, string>> = { 4: "Fourth", 5: "Fifth" };

/** the name an unlock shows once found: the charm's, or the slot's */
export function unlockName(t: UnlockTarget): string {
  if (t.type === "charm") return CHARMS[t.id].name;
  return `${ORDINALS[t.number]} charm slot`;
}

/** what an unlock does once found: the charm's card text, or what the slot holds */
export function unlockText(t: UnlockTarget): string {
  if (t.type === "charm") return CHARMS[t.id].text;
  return `Carry ${t.number} charms in a run.`;
}

/** the name of a discovery for the toast and the end of run list: the unlock's, or the evolution's for a recipe */
export const discoveryName = (d: Discovery): string =>
  d.type === "unlock" ? unlockName(d.unlock.target) : (findSkill(d.skill)?.evolution.name ?? "");

/** the unlock that opens a charm; none for one a new player starts with */
export const unlockOf = (id: CharmId): Unlock | undefined =>
  UNLOCKS.find((u) => u.target.type === "charm" && u.target.id === id);

/** the slot unlocks, fourth before fifth */
export const slotUnlocks = (): readonly Unlock[] => UNLOCKS.filter((u) => u.target.type === "slot");
