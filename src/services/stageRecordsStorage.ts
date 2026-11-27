import type { StageRecords } from "../types/records";

const KEY = "warpblade-stage-records-v1";

export function loadStageRecords(): unknown {
  try {
    const text = localStorage.getItem(KEY);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export function saveStageRecords(records: StageRecords): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    return;
  }
}
