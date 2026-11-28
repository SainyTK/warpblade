import type { MeasureReading } from "../../types";
import { ESCALATION_MIN_STAGES, FAIR_WINDUP_MS, MEASURE_IDS } from "../constants";
import { round } from "./round";
import type { RoomsSummary } from "./summarize";

const rounded = (value: number | null, places: number): number | null => (value === null ? null : round(value, places));

export function readings(summary: RoomsSummary): MeasureReading[] {
  const { clearRate, fairHits, escalation, fightLength, skillGap, rewardRhythm } = summary;
  const failed = summary.failed.length ? `; ${summary.failed.length} runs failed` : "";
  return [
    {
      id: MEASURE_IDS.clearRate,
      raw: rounded(clearRate.percent, 1),
      note: `skilled cleared ${clearRate.clears} of ${clearRate.rooms} boss rooms${failed}`,
    },
    {
      id: MEASURE_IDS.fairHits,
      raw: rounded(fairHits.percent, 1),
      note: `${Math.round(fairHits.hpLostFair)} of ${Math.round(fairHits.hpLost)} HP lost after a tell of ${FAIR_WINDUP_MS} ms or more${failed}`,
    },
    {
      id: MEASURE_IDS.escalation,
      raw: rounded(escalation.rho, 3),
      note:
        escalation.rho === null
          ? `needs ${ESCALATION_MIN_STAGES} or more stages; ${escalation.stages} sampled`
          : `skilled HP lost per minute against stage tier over ${escalation.rooms} rooms${failed}`,
    },
    {
      id: MEASURE_IDS.fightLength,
      raw: rounded(fightLength.ratio, 3),
      note:
        fightLength.ratio === null
          ? "the skilled bot removed no boss HP in most rooms"
          : `median skilled time to kill over the designed kill time${failed}`,
    },
    {
      id: MEASURE_IDS.skillGap,
      raw: rounded(skillGap.ratio, 3),
      note: `boss HP removed: skilled ${round(skillGap.skilledRemoved, 2)}, mash ${round(skillGap.mashRemoved, 2)} bosses${failed}`,
    },
    {
      id: MEASURE_IDS.rewardRhythm,
      raw: rounded(rewardRhythm.seconds, 2),
      note: `kept at half HP or more${failed}`,
    },
  ];
}
