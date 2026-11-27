import { recordStageRun } from "../store/stageRecords";
import type { SourceId } from "../types/build";
import type { RunOutcome, RunReport, SourceResult, StageResult } from "../types/run";
import { isHeroSource } from "../utils/sources";
import { stageGrade } from "../utils/stageGrade";
import { stageKey } from "../utils/trackedStats";
import { stageProgress, stageWhere } from "./adventure";
import { heldSources } from "./damageLedger";
import { character, game, progress } from "./state";

function skillState(id: SourceId): Pick<SourceResult, "level" | "evolved"> {
  if (isHeroSource(id)) return {};
  return { level: progress.build.skills[id] ?? 0, evolved: progress.build.evolved.includes(id) };
}

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
  return {
    stage: stage.stage,
    hyper: stage.hyper,
    cleared,
    grade: stageGrade({ ...stage, cleared, seconds: report.seconds }),
    damage,
    where: stageWhere(),
    miniDefeated: stage.miniDefeated,
    beaten: [],
  };
}

export function recordStageResult(result: StageResult, report: RunReport): StageResult {
  const beaten = recordStageRun({
    key: stageKey(result.stage, result.hyper),
    cleared: result.cleared,
    seconds: report.seconds,
    grade: result.grade,
    damage: result.damage,
    level: report.level,
  });
  return { ...result, beaten };
}
