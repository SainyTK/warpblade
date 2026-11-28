import { BOSS_CHEST_LEAST, ELITE_CHEST_LEAST, HIGHEST_WAVE, PLAN_SEED } from "../constants";
import type { BigFoeBeat, Game, Random, RouteArea, StageDef, StageMods, SurgeBeat } from "../types/game";
import type { Chest, StagePlan, StageStep } from "../types/model";
import { surgeFoeHp } from "./surgeFoeHp";

interface PlanContext {
  game: Game;
  stage: StageDef;
  mods: StageMods;
  random: Random;
  wave: number;
}

const waveFor = (game: Game, level: number): number =>
  Math.min(HIGHEST_WAVE, Math.max(1, Math.round(game.bandWave(level))));

function surgeStep(context: PlanContext, beat: SurgeBeat): StageStep {
  const { game, stage, mods, random } = context;
  context.wave = waveFor(game, beat.from);
  const span = beat.to - beat.from;
  const total = beat.waves.reduce((sum, size) => sum + size, 0);
  const chests: Chest[] = [];
  const foes: string[] = [];
  let done = 0;
  let index = 0;
  for (const size of beat.waves) {
    const from = beat.from + (span * done) / total;
    done += size;
    const to = beat.from + (span * done) / total;
    for (let i = 0; i < size; i++) {
      const level = game.levelBetween(from, to, i / Math.max(1, size - 1));
      foes.push(game.ladderFoe(stage, level, random));
      if (index > 0 && index % mods.eliteEvery === 0) {
        chests.push({ level: Math.floor(level), wave: context.wave, least: ELITE_CHEST_LEAST });
      }
      index++;
    }
  }
  return {
    kind: "surge",
    from: beat.from,
    to: beat.to,
    seconds: total * game.parPerSurgeFoe,
    chests,
    foes,
    bigFoe: null,
  };
}

function bigFoeStep(context: PlanContext, beat: BigFoeBeat, to: number): StageStep {
  const { game } = context;
  context.wave = waveFor(game, beat.level);
  const least = beat.kind === "boss" ? BOSS_CHEST_LEAST : ELITE_CHEST_LEAST;
  const adds = beat.kind === "boss" ? game.bossAdds(beat.foe) : [];
  return {
    kind: beat.kind,
    from: beat.level,
    to,
    seconds: game.parPerBigFoe,
    chests: [{ level: beat.level, wave: context.wave, least }],
    foes: [beat.foe, ...adds],
    bigFoe: beat.foe,
  };
}

function areaSteps(context: PlanContext, area: RouteArea, index: number, walkSeconds: number): StageStep[] {
  const { game, stage } = context;
  const arcs = game.stageArcs[stage.kind];
  const arc = arcs[Math.min(index, arcs.length - 1)];
  const steps: StageStep[] = [];
  if (index === 0) {
    context.wave = waveFor(game, area.enter);
  }
  const mini = area.packs.find((pack) => pack.mini)?.mini;
  if (mini && arc.mini !== undefined) {
    steps.push({ ...bigFoeStep(context, mini, arc.mini), foes: [mini.foe, ...stage.mini.adds] });
  }
  const roadFoes = area.packs.flatMap((pack) => pack.foes);
  steps.push({
    kind: "road",
    from: arc.mini ?? arc.enter,
    to: arc.gate,
    seconds: stage.areas[index].parSeconds + walkSeconds,
    chests: roadFoes
      .filter((foe) => foe.elite)
      .map((foe) => ({ level: Math.floor(foe.level), wave: context.wave, least: ELITE_CHEST_LEAST })),
    foes: roadFoes.map((foe) => foe.type),
    bigFoe: null,
  });
  area.beats.forEach((beat, beatIndex) => {
    steps.push(beat.kind === "surge" ? surgeStep(context, beat) : bigFoeStep(context, beat, arc.beats[beatIndex].to));
  });
  return steps;
}

export function planStage(game: Game, stageId: string): StagePlan {
  const stage = game.stages[stageId];
  const mods = game.stageMods(stage);
  const random = game.random(PLAN_SEED);
  const route = game.buildRoute(stage, mods, random);
  const areaPar = route.areas.reduce((sum, area) => sum + area.parSeconds, 0);
  const approachPar = stage.areas.reduce((sum, approach) => sum + approach.parSeconds, 0);
  const walkTotal = route.parSeconds - areaPar;
  const context: PlanContext = { game, stage, mods, random, wave: 1 };
  const played = route.areas.flatMap((area, index) =>
    areaSteps(context, area, index, (walkTotal * stage.areas[index].parSeconds) / approachPar),
  );
  const finalBoss = played[played.length - 1];
  const steps = [...played.slice(0, -1), { ...finalBoss, chests: [] }];
  const openingActEnd = steps.findIndex((step) => step.kind === "elite");
  if (openingActEnd < 0 || finalBoss.kind !== "boss") {
    throw new Error(`${stageId} has no opening-act elite or no final boss in its arc`);
  }
  const openingLevel = steps[openingActEnd].to;
  return {
    id: stageId,
    parSeconds: route.parSeconds,
    hazard: Boolean(stage.hazard),
    steps,
    openingActEnd,
    openingLevel,
    bossLevel: finalBoss.from,
    foeHpGrowth: surgeFoeHp(game, stage, mods, finalBoss.from) / surgeFoeHp(game, stage, mods, openingLevel),
  };
}
