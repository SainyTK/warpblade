import { FOES_IN_REACH_HIGH, FOES_IN_REACH_LOW, LUCK } from "../constants";
import type { Build, Game, HeroDef, Random } from "../types/game";
import type { CardPolicy, Crowd, FirstSeen, RunRecord, StagePlan, StageStep } from "../types/model";
import { applyCard, canGrow } from "./buildEdits";
import { chooseCard } from "./chooseCard";
import { coreOfFour } from "./coreOfFour";
import { heroDps } from "./heroDps";

export interface RunSetup {
  game: Game;
  hero: HeroDef;
  policy: CardPolicy;
  seed: number;
  plans: readonly StagePlan[];
  crowd: Crowd;
}

interface CrowdDps {
  low: number;
  assumed: number;
  high: number;
}

interface RunState {
  build: Build;
  random: Random;
  level: number;
  banked: number;
  clock: number;
  picks: number;
  picksBeforeFull: number;
  chests: number;
  chestUpgrades: number;
  chestEvolutions: number;
  fullAtSeconds: number | null;
  takenOrder: string[];
  skillsFirstOffered: Map<string, number>;
  evolutions: FirstSeen[];
}

function bankLevels(state: RunState, game: Game, level: number): void {
  if (level > state.level) {
    state.banked += game.picksBetween(state.level, level);
    state.level = level;
  }
}

function spendPicks(setup: RunSetup, state: RunState): void {
  const { game, hero, policy, crowd } = setup;
  while (state.banked > 0) {
    state.banked--;
    const view = { build: state.build, level: state.level, charged: true };
    const cards = game.dealCards(hero, view, state.random, game.cardCount(LUCK, state.random), game.boons);
    state.picks++;
    if (state.fullAtSeconds === null) {
      state.picksBeforeFull++;
    }
    for (const card of cards) {
      if (card.type === "skill" && !state.skillsFirstOffered.has(card.id)) {
        state.skillsFirstOffered.set(card.id, state.clock);
      }
    }
    const context = { game, hero, level: state.level, build: state.build, crowd, random: state.random };
    const pick = chooseCard(policy, context, cards);
    if (pick.type === "skill" && pick.level === 1) {
      state.takenOrder.push(pick.id);
    }
    applyCard(state.build, pick, game.growth);
  }
}

function openChests(setup: RunSetup, state: RunState, step: StageStep): void {
  const { game, hero } = setup;
  const span = Math.max(1, step.to - step.from);
  for (const chest of step.chests) {
    if (step.kind === "surge" || step.kind === "road") {
      bankLevels(state, game, chest.level);
    }
    state.chests++;
    for (const reward of game.rollChest(hero, state.build, chest.wave, LUCK, state.random, chest.least)) {
      if (reward.type === "evolve" && reward.id !== undefined) {
        state.chestEvolutions++;
        if (!state.build.evolved.includes(reward.id)) {
          state.build.evolved.push(reward.id);
          const seconds = state.clock + (step.seconds * (chest.level - step.from)) / span;
          state.evolutions.push({ id: reward.id, seconds });
        }
      } else if (reward.type !== "heal" && reward.id !== undefined) {
        state.chestUpgrades++;
        applyCard(state.build, { type: reward.type, id: reward.id }, game.growth);
      }
    }
  }
}

function markFull(setup: RunSetup, state: RunState): void {
  if (state.fullAtSeconds === null && !canGrow(state.build, setup.game.growth, setup.hero.skills.length)) {
    state.fullAtSeconds = state.clock;
  }
}

export function simulateRun(setup: RunSetup): RunRecord {
  const { game, hero, policy, seed, plans, crowd } = setup;
  const random = game.random(seed);
  const plan = plans[Math.floor(random.next() * plans.length)];
  const state: RunState = {
    build: game.freshBuild(),
    random,
    level: 1,
    banked: 0,
    clock: 0,
    picks: 0,
    picksBeforeFull: 0,
    chests: 0,
    chestUpgrades: 0,
    chestEvolutions: 0,
    fullAtSeconds: null,
    takenOrder: [],
    skillsFirstOffered: new Map(),
    evolutions: [],
  };
  const crowdDps = (): CrowdDps => {
    const at = (foesInReach: number): number =>
      heroDps(game, hero, state.level, state.build, { ...crowd, foesInReach });
    return { low: at(FOES_IN_REACH_LOW), assumed: at(crowd.foesInReach), high: at(FOES_IN_REACH_HIGH) };
  };
  const finalBoss = plan.steps.length - 1;
  let openingDps: CrowdDps | null = null;
  let bossDps: CrowdDps | null = null;
  for (const [index, step] of plan.steps.entries()) {
    if (index === finalBoss) {
      bossDps = crowdDps();
    }
    openChests(setup, state, step);
    bankLevels(state, game, step.to);
    state.clock += step.seconds;
    markFull(setup, state);
    spendPicks(setup, state);
    markFull(setup, state);
    if (index === plan.openingActEnd) {
      openingDps = crowdDps();
    }
  }
  if (!openingDps || !bossDps) {
    throw new Error(`${plan.id} never reached the end of its opening act or its final boss`);
  }
  return {
    hero: hero.id,
    policy,
    seed,
    stage: plan.id,
    finalLevel: state.level,
    heroDpsGrowth: bossDps.assumed / openingDps.assumed,
    heroDpsGrowthLowCrowd: bossDps.low / openingDps.low,
    heroDpsGrowthHighCrowd: bossDps.high / openingDps.high,
    foeHpGrowth: plan.foeHpGrowth,
    parSeconds: plan.parSeconds,
    fullAtSeconds: state.fullAtSeconds,
    picks: state.picks,
    picksBeforeFull: state.picksBeforeFull,
    chests: state.chests,
    chestUpgrades: state.chestUpgrades,
    chestEvolutions: state.chestEvolutions,
    core: coreOfFour(state.build, state.takenOrder),
    skillsFirstOffered: [...state.skillsFirstOffered].map(([id, seconds]) => ({ id, seconds })),
    evolutions: state.evolutions,
  };
}
