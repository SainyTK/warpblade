const KEY = "warpblade-hero";

/** the hero last chosen in this browser, or nothing */
export function loadHeroChoice(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}
export function saveHeroChoice(id: string): void {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    // private windows can refuse storage; the choice then lasts for this visit only
  }
}
