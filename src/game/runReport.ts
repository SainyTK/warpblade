import { RIFT_STAGES, STAGES } from "../stages";
import { recordCampaignRun } from "../store/campaignRecords";
import type { SourceId } from "../types/build";
import type { RunOutcome, RunReport, SourceResult, StageResult } from "../types/run";
import { isHeroSource } from "../utils/sources";
import { stageGrade } from "../utils/stageGrade";
import { clearedStages, stageProgress, stageStatus } from "./adventure";
import { heldSources } from "./damageLedger";
import { character, game, progress } from "./state";

/** a skill's level and whether it evolved, from the build the hero ends with; the hero's own sources have none */
function skillState(id: SourceId): Pick<SourceResult, "level" | "evolved"> {
  if (isHeroSource(id)) return {};
  return { level: progress.build.skills[id] ?? 0, evolved: progress.build.evolved.includes(id) };
}

/** what the hero in play did this run; read before the run is reset */
export function runReport(): RunReport {
  return {
    hero: character.id,
    seconds: game.clock,
    cleared: game.cleared,
    level: progress.level,
    kills: game.kills,
    ultimate: progress.ultimate,
    sources: heldSources().map((s) => ({ ...s, ...skillState(s.id) })),
  };
}

export function stageResult(report: RunReport, outcome: RunOutcome): StageResult {
  const stage = stageProgress();
  const cleared = outcome === "clear" || outcome === "beyond";
  const damage = Math.round(report.sources.reduce((total, source) => total + source.damage, 0));
  const grade = stageGrade({ ...stage, cleared, seconds: report.seconds });
  const sealed = clearedStages().filter((id) => STAGES[id].kind === "rift").length;
  const beaten = recordCampaignRun({ sealed, cleared, seconds: report.seconds, grade, damage, level: report.level });
  return {
    bossesDefeated: stage.bossesDefeated,
    bossesTotal: stage.bossesTotal,
    distance: stage.distance,
    damage,
    grade,
    sealed,
    sealedTotal: RIFT_STAGES.length,
    cleared,
    where: stageStatus(),
    beaten,
  };
}
