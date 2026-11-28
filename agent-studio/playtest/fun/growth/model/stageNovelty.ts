import { BOSS_ATTACKS, NOVELTY_WINDOW_MINUTES, SECONDS_PER_MINUTE } from "../constants";
import type { Game } from "../types/game";
import type { RunRecord, StageNovelty, StagePlan } from "../types/model";

type WorldKind = "place" | "hazard" | "side" | "foe" | "bossAttack";

interface WorldEvent {
  seconds: number;
  kind: WorldKind;
  id: string;
}

function worldEvents(game: Game, plan: StagePlan): WorldEvent[] {
  const stage = game.stages[plan.id];
  const events: WorldEvent[] = [{ seconds: 0, kind: "place", id: plan.id }];
  if (plan.hazard) {
    events.push({ seconds: 0, kind: "hazard", id: plan.id });
  }
  for (const side of plan.sides) {
    events.push({ seconds: side.seconds, kind: "side", id: side.id });
  }
  for (const step of plan.steps) {
    for (const foe of step.foes) {
      events.push({ seconds: step.at, kind: "foe", id: foe });
    }
    if (step.kind === "mini") {
      events.push({ seconds: step.at, kind: "foe", id: `mini:${stage.mini.name}` });
      for (const move of stage.mini.moves) {
        events.push({ seconds: step.at, kind: "bossAttack", id: `mini:${move}` });
      }
    }
    if (step.kind === "boss" && step.bigFoe !== null) {
      for (const attack of BOSS_ATTACKS[step.bigFoe] ?? []) {
        events.push({ seconds: step.at, kind: "bossAttack", id: `${step.bigFoe}:${attack}` });
      }
    }
  }
  return events;
}

function firstSeenAfter(events: readonly WorldEvent[], half: number): Record<WorldKind, number> {
  const counts: Record<WorldKind, number> = { place: 0, hazard: 0, side: 0, foe: 0, bossAttack: 0 };
  const seen = new Set<string>();
  for (const event of [...events].sort((a, b) => a.seconds - b.seconds)) {
    const key = `${event.kind}:${event.id}`;
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    if (event.seconds >= half) {
      counts[event.kind]++;
    }
  }
  return counts;
}

export function stageNovelty(game: Game, plan: StagePlan, runs: readonly RunRecord[]): StageNovelty {
  const half = plan.parSeconds / 2;
  const world = firstSeenAfter(worldEvents(game, plan), half);
  const onStage = runs.filter((run) => run.stage === plan.id);
  const lateCount = (pick: (run: RunRecord) => readonly { seconds: number }[]): number =>
    onStage.reduce((sum, run) => sum + pick(run).filter((item) => item.seconds >= half).length, 0) /
    Math.max(1, onStage.length);
  const skills = lateCount((run) => run.skillsFirstOffered);
  const evolutions = lateCount((run) => run.evolutions);
  const worldTotal = Object.values(world).reduce((sum, count) => sum + count, 0);
  const halfMinutes = half / SECONDS_PER_MINUTE;
  return {
    stage: plan.id,
    minutes: plan.parSeconds / SECONDS_PER_MINUTE,
    world,
    skills,
    evolutions,
    runs: onStage.length,
    perTenMinutes: ((worldTotal + skills + evolutions) / halfMinutes) * NOVELTY_WINDOW_MINUTES,
  };
}
