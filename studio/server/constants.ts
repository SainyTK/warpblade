export const JSON_BODY_LIMIT = 4 * 1024 * 1024;

/** The heroes in the repository. A hero's motion clips are in its `motion` folder, one JSON file per clip, as the game loads them. */
export const HEROES_DIR = 'src/heroes';

export const heroMotionDir = (hero: string): string => `${HEROES_DIR}/${hero}/motion`;
