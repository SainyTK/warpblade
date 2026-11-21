import { loadEffectAtlas, readyEffectAtlas } from "./atlas";
import { EFFECT_HEROES } from "./constants";
import type { EffectHero, EffectSlot, EffectSprite } from "./types";

export function isEffectHero(id: string): id is EffectHero {
  return (EFFECT_HEROES as readonly string[]).includes(id);
}

export function effectSprite(hero: string, slot: EffectSlot): EffectSprite | undefined {
  if (!isEffectHero(hero)) {
    return undefined;
  }
  const atlas = readyEffectAtlas(hero);
  if (!atlas) {
    void loadEffectAtlas(hero);
  }
  return atlas?.get(slot);
}

export async function preloadEffectArt(heroes: readonly string[] = EFFECT_HEROES): Promise<void> {
  await Promise.all(heroes.filter(isEffectHero).map(loadEffectAtlas));
}
