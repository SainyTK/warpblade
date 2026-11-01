const KEY = "warpblade-best";

/** The best kill count, kept in this browser only. */
export function loadBest(): number {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}
export function saveBest(best: number): void {
  try {
    localStorage.setItem(KEY, String(best));
  } catch {
    // private windows can refuse storage; the best score then lasts for this visit only
  }
}
