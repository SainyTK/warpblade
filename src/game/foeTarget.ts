import type { Enemy } from "../types/enemy";

let besieging: Enemy | null = null;

export const besiegingFoe = (): Enemy | null => besieging;

export function setBesiegingFoe(foe: Enemy | null): void {
  besieging = foe;
}
