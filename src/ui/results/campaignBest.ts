import type { CampaignRecordKey, CampaignRecords } from "../../types/records";
import { minutesSeconds, shortNumber } from "../../utils/runReport";

const ROWS: readonly { key: CampaignRecordKey; label: string; value(r: CampaignRecords, total: number): string }[] = [
  { key: "mostSealed", label: "Most rifts sealed", value: (r, total) => `${r.mostSealed}/${total}` },
  {
    key: "fastestClear",
    label: "Fastest clear",
    value: (r) => (r.fastestClear === null ? "Not yet" : minutesSeconds(r.fastestClear)),
  },
  { key: "bestGrade", label: "Best grade", value: (r) => r.bestGrade ?? "Not yet" },
  { key: "mostDamage", label: "Most damage", value: (r) => shortNumber(r.mostDamage) },
  { key: "highestLevel", label: "Highest level", value: (r) => String(r.highestLevel) },
];

export function campaignBest(
  records: CampaignRecords,
  beaten: readonly CampaignRecordKey[],
  total: number,
): HTMLElement {
  const box = document.createElement("table");
  box.className = "campaign-best";
  const caption = document.createElement("caption");
  caption.textContent = "Best runs";
  box.append(caption);
  const body = document.createElement("tbody");
  for (const row of ROWS) {
    const tr = document.createElement("tr");
    const name = document.createElement("th");
    name.scope = "row";
    name.textContent = row.label;
    const value = document.createElement("td");
    value.textContent = row.value(records, total);
    const mark = document.createElement("td");
    mark.className = "campaign-new";
    mark.textContent = beaten.includes(row.key) ? "New record" : "";
    tr.append(name, value, mark);
    body.append(tr);
  }
  box.append(body);
  return box;
}
