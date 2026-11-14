const KEY = "warpblade-best-wave";

/** The furthest wave reached as older versions saved it, read once so achievements count it. */
export function loadBest(): number {
  try {
    return Number(localStorage.getItem(KEY)) || 0;
  } catch {
    return 0;
  }
}
