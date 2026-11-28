import type { CrystalWatch } from "../../types/defense";

let watched: CrystalWatch | null = null;

export const guestCrystal = (): CrystalWatch | null => watched;

export function setGuestCrystal(next: CrystalWatch | null): void {
  watched = next;
}
