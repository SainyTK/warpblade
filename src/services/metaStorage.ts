import type { MetaSave } from "../types/shop";

/** the version is in the key, so a future change of shape starts from a fresh save */
const KEY = "warpblade-meta-v1";

/** the saved meta progress as parsed JSON, or null when there is none, it is not JSON, or storage is refused */
export function loadMeta(): unknown {
  try {
    const text = localStorage.getItem(KEY);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}
export function saveMeta(save: MetaSave): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // private windows can refuse storage; the coins and upgrades then last for this visit only
  }
}
