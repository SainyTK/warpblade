import { FAIR_WINDUP_MS, SHORT_TELL_LIST } from "../constants";
import type { RoomRun } from "../types";

export interface FairHits {
  percent: number | null;
  hpLost: number;
  hpLostFair: number;
  hpLostNoTell: number;
  shortTells: Record<string, number>;
}

export function fairHits(runs: readonly RoomRun[]): FairHits {
  const hits = runs.filter((run) => run.policy === "skilled").flatMap((run) => run.hits);
  const hpLost = hits.reduce((sum, hit) => sum + hit.loss, 0);
  const fair = hits.filter((hit) => hit.windupMs !== null && hit.windupMs >= FAIR_WINDUP_MS);
  const hpLostFair = fair.reduce((sum, hit) => sum + hit.loss, 0);
  const hpLostNoTell = hits.filter((hit) => hit.windupMs === null).reduce((sum, hit) => sum + hit.loss, 0);
  const short = new Map<string, number>();
  for (const hit of hits) {
    if (hit.windupMs !== null && hit.windupMs < FAIR_WINDUP_MS) {
      const key = `${hit.foe}:${hit.state}`;
      short.set(key, (short.get(key) ?? 0) + hit.loss);
    }
  }
  const shortTells = Object.fromEntries(
    [...short.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, SHORT_TELL_LIST)
      .map(([key, loss]) => [key, Math.round(loss)]),
  );
  return { percent: hpLost ? (hpLostFair / hpLost) * 100 : null, hpLost, hpLostFair, hpLostNoTell, shortTells };
}
