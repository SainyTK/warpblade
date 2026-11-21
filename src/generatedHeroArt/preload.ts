import { registerHeroArt } from "../rig";
import type { CharacterDef, HeroSkin } from "../types/character";
import { createGeneratedPainter } from "./canvasPainter";
import { loadGeneratedHeroArt } from "./load";

async function install(id: string, skin: HeroSkin): Promise<void> {
  const art = await loadGeneratedHeroArt(id).catch((error: unknown) => {
    console.warn(`Generated art could not load for ${id}`, error);
    return undefined;
  });
  if (art) {
    registerHeroArt(skin, createGeneratedPainter(skin, art));
  }
}

interface ArtRosterHero extends Pick<CharacterDef, "id" | "skin"> {
  jobs?: readonly { id: string; skin: HeroSkin }[];
}

export async function preloadGeneratedRoster(roster: readonly ArtRosterHero[]): Promise<void> {
  await Promise.all(
    roster.flatMap((hero) => [
      install(hero.id, hero.skin),
      ...(hero.jobs ?? []).map((job) => install(`${hero.id}-${job.id}`, job.skin)),
    ]),
  );
}
