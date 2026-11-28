import type { Build, Card, Game, HeroDef, Random } from "../types/game";
import type { CardPolicy, Crowd } from "../types/model";
import { applyCard, cloneBuild } from "./buildEdits";
import { heroDps } from "./heroDps";

export interface PickContext {
  game: Game;
  hero: HeroDef;
  level: number;
  build: Build;
  crowd: Crowd;
  random: Random;
}

function strongestCard(context: PickContext, cards: readonly Card[]): Card {
  const { game, hero, level, build, crowd } = context;
  let best = cards[0];
  let bestDps = -1;
  for (const card of cards) {
    const trial = cloneBuild(build);
    applyCard(trial, card, game.growth);
    const dps = heroDps(game, hero, level, trial, crowd);
    if (dps > bestDps) {
      bestDps = dps;
      best = card;
    }
  }
  return best;
}

export function chooseCard(policy: CardPolicy, context: PickContext, cards: readonly Card[]): Card {
  return policy === "strongest" ? strongestCard(context, cards) : context.random.pick(cards);
}
