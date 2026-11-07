import { objectMemory, rememberPerSeat } from "../seatMemory";

/**
 * A kit's ability rotation: the abilities on its ability button (its base abilities and the spell skills held, up to
 * about five), one of them selected. The kit decides which button turns it and what an ability costs (MP, Heat or
 * nothing). Each co-op seat keeps its own selection.
 */
export interface Rotation {
  /** the selected ability, moved onto an available one when it is not; null when none is available */
  selected(): string | null;
  /** move to the next available ability; true when the selection changed */
  next(): boolean;
  /** a fresh run: back to the first entry */
  reset(): void;
}

/** a rotation over `entries` (ability ids in order), of which `available` says which the hero has now */
export function createRotation(entries: readonly string[], available: (id: string) => boolean): Rotation {
  const choice = { index: 0 };
  rememberPerSeat(objectMemory(choice));
  const next = (): boolean => {
    for (let step = 1; step <= entries.length; step++) {
      const i = (choice.index + step) % entries.length;
      if (!available(entries[i])) continue;
      const moved = i !== choice.index;
      choice.index = i;
      return moved;
    }
    return false;
  };
  return {
    selected() {
      if (!available(entries[choice.index])) next();
      return available(entries[choice.index]) ? entries[choice.index] : null;
    },
    next,
    reset() {
      choice.index = 0;
    },
  };
}
