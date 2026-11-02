import type { Settings } from "../types/settings";

const KEY = "warpblade-settings";

/** the options saved in this browser, or nothing when there are none or storage is refused */
export function loadSettings(): Partial<Settings> {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    return saved && typeof saved === "object" ? saved : {};
  } catch {
    return {};
  }
}
export function saveSettings(settings: Settings): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch {
    // private windows can refuse storage; the options then last for this visit only
  }
}
