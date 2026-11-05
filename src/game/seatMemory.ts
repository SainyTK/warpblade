/**
 * Hero state that belongs to one player. Solo play has one hero and never reads this list.
 * A co-op room keeps one copy per player and swaps it in before running or drawing that player's hero.
 */
export interface SeatMemory {
  /** a copy of the live state */
  save(): unknown;
  /** put a saved copy back into the live state */
  load(saved: unknown): void;
}

const memories: SeatMemory[] = [];

export function rememberPerSeat(memory: SeatMemory): void {
  memories.push(memory);
}

export const seatMemories = (): readonly SeatMemory[] => memories;

/** a plain object whose own fields are swapped whole; nested objects are shared until the owner replaces them */
export function objectMemory<T extends object>(live: T): SeatMemory {
  return {
    save: () => ({ ...live }),
    load(saved) {
      const from = saved as Record<string, unknown>;
      const into = live as Record<string, unknown>;
      for (const key of Object.keys(into)) if (!(key in from)) delete into[key];
      Object.assign(into, from);
    },
  };
}
