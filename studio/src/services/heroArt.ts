import { preloadGeneratedRoster } from '@game/generatedHeroArt';
import { CHARACTERS } from '@game/heroes/roster';

/** Loads every hero's art the game draws them with, so the studio's drawHero draws it too. */
export const installHeroArt = (): Promise<void> => preloadGeneratedRoster(CHARACTERS);
