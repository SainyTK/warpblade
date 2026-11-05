import type { Page } from "playwright-core";
import { GAME_MODULES } from "../constants/game";
import type { CharactersModule } from "../types/gameModules";
import type { HeroInfo } from "../types/snapshot";

/** every playable hero the game has, in hero screen order */
export function readHeroes(page: Page): Promise<HeroInfo[]> {
  return page.evaluate(async (path) => {
    const { CHARACTERS } = (await import(path)) as CharactersModule;
    return CHARACTERS.map((c) => ({ id: c.id, name: c.name }));
  }, GAME_MODULES.characters);
}
