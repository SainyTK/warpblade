import { parseIdList } from "../utils/parseIdList";

/** A list of feedback IDs kept in this browser under one key. */
export function loadIdList(key: string): number[] {
  try {
    const text = localStorage.getItem(key);
    return text ? parseIdList(JSON.parse(text)) : [];
  } catch {
    return [];
  }
}

export function saveIdList(key: string, ids: readonly number[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    // private windows can refuse storage; the list then lasts for this visit only
  }
}
