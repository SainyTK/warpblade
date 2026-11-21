import { decodeEffectImage } from "./image";
import type { EffectAtlasMap, EffectHero, EffectSlot, EffectSprite } from "./types";

type EffectAtlas = ReadonlyMap<EffectSlot, EffectSprite>;

const images = import.meta.glob<string>("./assets/*/atlas.png", { eager: true, query: "?url", import: "default" });
const maps = import.meta.glob<EffectAtlasMap>("./assets/*/atlas.json", { eager: true, import: "default" });
const loads = new Map<EffectHero, Promise<EffectAtlas | undefined>>();
const ready = new Map<EffectHero, EffectAtlas>();

async function load(hero: EffectHero): Promise<EffectAtlas | undefined> {
  const url = images[`./assets/${hero}/atlas.png`];
  const map = maps[`./assets/${hero}/atlas.json`];
  if (!url || !map) {
    return undefined;
  }
  const image = await decodeEffectImage(url);
  const atlas = new Map<EffectSlot, EffectSprite>();
  for (const [slot, entry] of Object.entries(map.slots) as [EffectSlot, EffectSprite][]) {
    atlas.set(slot, { image, frames: entry.frames, fps: entry.fps });
  }
  ready.set(hero, atlas);
  return atlas;
}

export function loadEffectAtlas(hero: EffectHero): Promise<EffectAtlas | undefined> {
  const existing = loads.get(hero);
  if (existing) {
    return existing;
  }
  const pending = load(hero).catch((error: unknown) => {
    console.warn(`Effect art could not load for ${hero}`, error);
    return undefined;
  });
  loads.set(hero, pending);
  return pending;
}

export function readyEffectAtlas(hero: EffectHero): EffectAtlas | undefined {
  return ready.get(hero);
}
