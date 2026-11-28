import type { Game, StageDef, StageMods } from "../types/game";

export function surgeFoeHp(game: Game, stage: StageDef, mods: StageMods, level: number): number {
  const choices = game.ladderChoices(stage.ladder, level);
  let weighted = 0;
  let weights = 0;
  for (const choice of choices) {
    const entry = stage.ladder.find((rung) => rung.foe === choice.foe);
    if (!entry) {
      continue;
    }
    const toughness = game.flies(choice.foe) ? game.flyerToughness : 1;
    weighted += choice.weight * game.ladderHp(entry, mods) * toughness;
    weights += choice.weight;
  }
  return weights > 0 ? weighted / weights : 0;
}
