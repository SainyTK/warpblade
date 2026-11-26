import type { CampaignRecords } from "../types/records";

const KEY = "warpblade-campaign-records-v1";

export function loadCampaignRecords(): unknown {
  try {
    const text = localStorage.getItem(KEY);
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export function saveCampaignRecords(records: CampaignRecords): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(records));
  } catch {
    return;
  }
}
