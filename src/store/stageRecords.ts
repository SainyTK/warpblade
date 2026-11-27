import { loadCampaignRecords, saveCampaignRecords } from "../services/campaignRecordsStorage";
import type { CampaignRecordKey, CampaignRecords, CampaignRun } from "../types/records";
import { parseCampaignRecords, withCampaignRun } from "../utils/campaignRecords";

let records: CampaignRecords = parseCampaignRecords(loadCampaignRecords());

export const campaignRecords = (): CampaignRecords => records;

export function recordCampaignRun(run: CampaignRun): CampaignRecordKey[] {
  const result = withCampaignRun(records, run);
  if (!result.beaten.length) return [];
  records = result.records;
  saveCampaignRecords(records);
  return result.beaten;
}
