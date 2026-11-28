import type { MeasureReading } from "../types";
import { FIRST_RUN_SEED, FOES_IN_REACH, HITS_PER_FOE, MINION_SHARE, OUTPUT_FILES, PLAN_SEED } from "./constants";
import { planStage, simulateRuns, stageNovelty } from "./model";
import { needsRandomRuns, needsStrongestRuns, readGrowth } from "./readings";
import { installBrowserStubs } from "./services/browserStubs";
import { gameBundle } from "./services/gameBundle";
import { loadGame } from "./services/loadGame";
import { writeJson } from "./services/writeJson";
import type { Game, HeroDef } from "./types/game";
import type { CardPolicy, Crowd, GrowthData, GrowthSample, RunRecord, StagePlan } from "./types/model";

const CROWD: Crowd = { foesInReach: FOES_IN_REACH, hitsPerFoe: HITS_PER_FOE, minionShare: MINION_SHARE };

function sampledHeroes(game: Game, ids: readonly string[]): HeroDef[] {
  return ids.map((id) => {
    const hero = game.heroes.find((candidate) => candidate.id === id);
    if (!hero) {
      throw new Error(`the game has no hero ${id}`);
    }
    return hero;
  });
}

function runsWhen(
  needed: boolean,
  game: Game,
  heroes: readonly HeroDef[],
  sample: GrowthSample,
  plans: readonly StagePlan[],
  policy: CardPolicy,
): RunRecord[] {
  return needed ? simulateRuns({ game, heroes, runs: sample.runs, plans, policy, crowd: CROWD }) : [];
}

export async function measureSample(sample: GrowthSample): Promise<MeasureReading[]> {
  const startedAt = performance.now();
  installBrowserStubs();
  const bundle = await gameBundle(sample.root);
  const game = await loadGame(bundle.file);
  const loadedSeconds = (performance.now() - startedAt) / 1000;
  const heroes = sampledHeroes(game, sample.heroes);
  const plans = game.stageOrder.map((id) => planStage(game, id));
  const randomRuns = runsWhen(needsRandomRuns(sample.measures), game, heroes, sample, plans, "random");
  const strongestRuns = runsWhen(needsStrongestRuns(sample.measures), game, heroes, sample, plans, "strongest");
  const novelty = randomRuns.length ? plans.map((plan) => stageNovelty(game, plan, randomRuns)) : [];
  const data: GrowthData = { plans, randomRuns, strongestRuns, novelty };
  const readings = readGrowth(sample.measures, data);
  writeJson(sample.outDir, OUTPUT_FILES.runs, { random: randomRuns, strongest: strongestRuns });
  writeJson(
    sample.outDir,
    OUTPUT_FILES.stages,
    plans.map(({ steps, ...plan }) => ({
      ...plan,
      steps: steps.length,
      chests: steps.flatMap((s) => s.chests).length,
    })),
  );
  writeJson(sample.outDir, OUTPUT_FILES.novelty, novelty);
  writeJson(sample.outDir, OUTPUT_FILES.summary, {
    root: sample.root,
    bundle: { key: bundle.key, built: bundle.built },
    profile: "every skill open, no Rift Arts",
    measures: sample.measures,
    heroes: sample.heroes,
    runsPerHeroAndPolicy: sample.runs,
    firstRunSeed: FIRST_RUN_SEED,
    planSeed: PLAN_SEED,
    crowd: CROWD,
    loadedSeconds,
    wallSeconds: (performance.now() - startedAt) / 1000,
    readings,
  });
  return readings;
}
