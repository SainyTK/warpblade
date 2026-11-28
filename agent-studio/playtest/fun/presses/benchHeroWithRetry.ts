import type { Harness } from "../../session/harness";
import { benchHero } from "./benchHero";
import { HERO_ATTEMPTS } from "./constants";
import type { HeroBench } from "./types";

export async function benchHeroWithRetry(harness: Harness, hero: string): Promise<HeroBench> {
  let failure = "";
  for (let attempt = 1; attempt <= HERO_ATTEMPTS; attempt++) {
    try {
      return { hero, presses: await benchHero(harness, hero), failure: null };
    } catch (error) {
      failure = error instanceof Error ? (error.message.split("\n")[0] ?? error.message) : String(error);
    }
  }
  return { hero, presses: null, failure };
}
