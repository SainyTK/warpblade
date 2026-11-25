import { decodeArtImage } from "./image";
import { ATLAS_SIZE, createHeroSprite } from "./sprite";
import type { GeneratedHeroArt, SpriteProfile } from "./types";

const atlases = import.meta.glob<string>("./assets/*/atlas.png", { eager: true, query: "?url", import: "default" });
const equipment = import.meta.glob<string>("./assets/*/offhand.png", { eager: true, query: "?url", import: "default" });
const profiles = import.meta.glob<SpriteProfile>("./assets/*/profile.json", { eager: true, import: "default" });
const loads = new Map<string, Promise<GeneratedHeroArt | undefined>>();

function checkProfile(id: string, profile: SpriteProfile): void {
  const { weaponGrip, weaponTipY } = profile;
  if (!weaponGrip.every(Number.isFinite) || !Number.isFinite(weaponTipY) || weaponTipY <= weaponGrip[1]) {
    throw new Error(`Invalid weapon art profile: ${id}`);
  }
}

async function load(id: string): Promise<GeneratedHeroArt | undefined> {
  const root = `./assets/${id}`;
  const atlas = atlases[`${root}/atlas.png`];
  const profile = profiles[`${root}/profile.json`];
  if (!atlas || !profile) {
    return undefined;
  }
  checkProfile(id, profile);
  const offhand = equipment[`${root}/offhand.png`];
  const [image, item] = await Promise.all([decodeArtImage(atlas), offhand ? decodeArtImage(offhand) : undefined]);
  if (image.naturalWidth !== ATLAS_SIZE[0] || image.naturalHeight !== ATLAS_SIZE[1]) {
    throw new Error(`Unexpected atlas dimensions: ${id}`);
  }
  return createHeroSprite(image, profile, item);
}

export function loadGeneratedHeroArt(id: string): Promise<GeneratedHeroArt | undefined> {
  const existing = loads.get(id);
  if (existing) {
    return existing;
  }
  const pending = load(id).catch((error: unknown) => {
    loads.delete(id);
    throw error;
  });
  loads.set(id, pending);
  return pending;
}
