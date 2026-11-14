import { HERO_SOURCES } from "../constants/damageSources";
import type { SourceId } from "../types/build";
import { objectMemory, rememberPerSeat } from "./seatMemory";
import { game } from "./state";

/** one source's damage so far, and the game time the hero first held it */
interface Tally {
  damage: number;
  since: number;
}

/**
 * Every hit of one hero this run, by source, for the end of run screen. Each co-op seat keeps its own.
 * A skill's own hits count as held from the first of them.
 */
const ledger: { start: number; sources: Partial<Record<SourceId, Tally>> } = { start: 0, sources: {} };
rememberPerSeat(objectMemory(ledger));

/** a fresh run: nothing dealt, the clock starts now */
export function resetLedger(): void {
  ledger.start = game.t;
  ledger.sources = {};
}

export function recordDamage(source: SourceId, amount: number): void {
  const tally = ledger.sources[source];
  if (tally) tally.damage += amount;
  else ledger.sources[source] = { damage: amount, since: HERO_SOURCES.has(source) ? ledger.start : game.t };
}

/** each source's damage and the seconds it has been held */
export function heldSources(): { id: SourceId; damage: number; seconds: number }[] {
  return (Object.entries(ledger.sources) as [SourceId, Tally][]).map(([id, t]) => ({
    id,
    damage: t.damage,
    seconds: game.t - t.since,
  }));
}
