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
  const grade = stageGrade({ ...stage, cleared, seconds: report.seconds });
  const beaten = recordStageRun({
    key: stageKey(stage.stage, stage.hyper),
    cleared,
    seconds: report.seconds,
    grade,
    damage,
    level: report.level,
  });
  return {
    stage: stage.stage,
    hyper: stage.hyper,
    cleared,
    grade,
    damage,
    where: stageWhere(),
    miniDefeated: stage.miniDefeated,
    beaten,
  };
}
