import { BOSS_CHEST_LEAST, ELITE_CHEST_LEAST, FIELD_STEP_SECONDS, HIGHEST_WAVE } from "../constants";
import type { BigFoeCall, Game, StageDef, StageMods } from "../types/game";
import type { Chest, StagePlan, StageStep } from "../types/model";
import { fieldFoeHp } from "./fieldFoeHp";

interface PlanContext {
  game: Game;
  stage: StageDef;
  mods: StageMods;
  bonusXp: number;
  elites: number;
  elitesOpened: number;
}

const waveFor = (game: Game, level: number): number =>
  Math.min(HIGHEST_WAVE, Math.max(1, Math.round(game.bandWave(level))));

function levelAtXp(game: Game, xp: number): number {
  let level = 1;
  while (level < game.maxLevel && game.xpToReach(level + 1) <= xp + 1e-6) {
    level++;
  }
  return level;
}

const levelAt = (context: PlanContext, seconds: number): number =>
  levelAtXp(context.game, context.game.xpToReach(context.game.levelAtSecond(seconds)) + context.bonusXp);

function fieldFoes(context: PlanContext, level: number): string[] {
  const { game, stage } = context;
  const walkers = game.ladderChoices(stage.ladder, level, (foe) => !game.flies(foe));
  const flyers = game.ladderChoices(stage.ladder, level, (foe) => game.flies(foe));
  return [...new Set([...walkers, ...flyers].map((choice) => choice.foe))];
}

function elitesIn(context: PlanContext, from: number, to: number): number {
  const { game, mods } = context;
  const eastEvery = game.defense.eliteEveryBySide.east ?? 0;
  let elites = 0;
  for (let second = from; second < to; second++) {
    const foes = game.foesPerSecond(second) * mods.crowd;
    const sides = game.frontAt(second).sides;
    const east = sides.includes("east") && eastEvery > 0 ? foes / sides.length / eastEvery : 0;
    elites += foes / mods.eliteEvery + east;
  }
  return elites;
}

function fieldStep(context: PlanContext, at: number, until: number): StageStep {
  const from = levelAt(context, at);
  const to = levelAt(context, until);
  context.elites += elitesIn(context, at, until);
  const opened = Math.floor(context.elites) - context.elitesOpened;
  context.elitesOpened += opened;
  const wave = waveFor(context.game, to);
  const chests: Chest[] = Array.from({ length: opened }, () => ({ level: to, wave, least: ELITE_CHEST_LEAST }));
  return { kind: "field", at, from, to, seconds: until - at, chests, foes: fieldFoes(context, to), bigFoe: null };
}

function bigFoeStep(context: PlanContext, call: BigFoeCall): StageStep {
  const { game, stage } = context;
  const from = levelAt(context, call.at);
  context.bonusXp +=
    game.xpToReach(game.levelAtSecond(call.at + game.defense.xpSeconds[call.kind])) -
    game.xpToReach(game.levelAtSecond(call.at));
  const to = levelAt(context, call.at);
  const least = call.kind === "boss" ? BOSS_CHEST_LEAST : ELITE_CHEST_LEAST;
  const foe = call.kind === "boss" ? stage.boss : call.kind === "mini" ? stage.mini.base : null;
  const foes =
    call.kind === "boss"
      ? [stage.boss, ...game.bossAdds(stage.boss)]
      : call.kind === "mini"
        ? [stage.mini.base, ...stage.mini.adds]
        : fieldFoes(context, from);
  return {
    kind: call.kind,
    at: call.at,
    from,
    to,
    seconds: 0,
    chests: [{ level: to, wave: waveFor(game, to), least }],
    foes,
    bigFoe: foe,
  };
}

function sideOpenings(game: Game): { id: string; seconds: number }[] {
  const seen = new Map<string, number>();
  for (let second = 0; second < game.defense.seconds; second++) {
    for (const side of game.frontAt(second).sides) {
      if (!seen.has(side)) {
        seen.set(side, second);
      }
    }
  }
  return [...seen].map(([id, seconds]) => ({ id, seconds }));
}

export function planStage(game: Game, stageId: string): StagePlan {
  const stage = game.stages[stageId];
  const mods = game.stageMods(stage);
  const context: PlanContext = { game, stage, mods, bonusXp: 0, elites: 0, elitesOpened: 0 };
  const total = game.defense.seconds;
  const steps: StageStep[] = [];
  for (let at = 0; at < total; at += FIELD_STEP_SECONDS) {
    const until = Math.min(total, at + FIELD_STEP_SECONDS);
    steps.push(fieldStep(context, at, until));
    for (const call of game.defense.calls.filter((entry) => entry.at >= at && entry.at < until)) {
      steps.push(bigFoeStep(context, call));
    }
  }
  const openingActEnd = steps.findIndex((step) => step.kind === "elite");
  const bossStep = steps.findIndex((step) => step.kind === "boss");
  if (openingActEnd < 0 || bossStep < 0) {
    throw new Error(`${stageId} has no elite call or no boss call in its defense`);
  }
  const openingLevel = steps[openingActEnd].to;
  const bossLevel = steps[bossStep].from;
  return {
    id: stageId,
    parSeconds: total,
    hazard: Boolean(stage.hazard),
    steps,
    sides: sideOpenings(game),
    openingActEnd,
    bossStep,
    openingLevel,
    bossLevel,
    foeHpGrowth: fieldFoeHp(game, stage, mods, bossLevel) / fieldFoeHp(game, stage, mods, openingLevel),
  };
}
