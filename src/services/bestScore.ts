const KEY = "warpblade-best-wave";

/** The furthest wave reached, kept in this browser only. */
export function loadBest(): number {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}
export function saveBest(wave: number): void {
  try {
    localStorage.setItem(KEY, String(wave));
  } catch {
    // private windows can refuse storage; the best wave then lasts for this visit only
  }
}
