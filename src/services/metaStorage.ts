import type { MetaSave } from "../types/armory";

const KEY = "warpblade-meta-v2";
const LEGACY_KEY = "warpblade-meta-v1";

function readJson(key: string): unknown {
  try {
    const text = localStorage.getItem(key);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export const loadMeta = (): unknown => readJson(KEY);
export const loadLegacyMeta = (): unknown => readJson(LEGACY_KEY);

export function saveMeta(save: MetaSave): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(save));
  } catch {
    // private windows can refuse storage; the coins and upgrades then last for this visit only
  }
}
