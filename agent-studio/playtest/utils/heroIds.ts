import type { HeroInfo } from "../types/snapshot";

/** the heroes a --hero flag asks for: "all" is every hero the game has, else one id that must exist */
export function heroIds(flag: string, heroes: readonly HeroInfo[]): string[] {
  if (flag === "all") {
    return heroes.map((hero) => hero.id);
  }
  if (!heroes.some((hero) => hero.id === flag)) {
    const known = heroes.map((hero) => hero.id).join(", ");
    throw new Error(`No hero "${flag}". The game has: ${known}.`);
  }
  return [flag];
}
