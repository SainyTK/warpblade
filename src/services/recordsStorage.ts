import type { RunRecords } from "../types/records";

/** the version is in the key, so a future change of shape starts from a fresh save */
const KEY = "warpblade-records-v1";

/** the saved records as parsed JSON, or null when there are none, they are not JSON, or storage is refused */
export function loadRecords(): unknown {
  try {
    const text = localStorage.getItem(KEY);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export function saveRecords(records: RunRecords): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    // private windows can refuse storage; the records then last for this visit only
  }
}
