import { drawKaelSprite, loadKaelSprite } from "../kaelSprite";
import { decodeArtImage } from "./image";
import { createPoseSprite } from "./poseSprite";
import type { GeneratedHeroArt, SpriteProfile } from "./types";

const atlases = import.meta.glob<string>("./assets/*/atlas.png", { eager: true, query: "?url", import: "default" });
const equipment = import.meta.glob<string>("./assets/*/offhand.png", { eager: true, query: "?url", import: "default" });
const profiles = import.meta.glob<SpriteProfile>("./assets/*/profile.json", { eager: true, import: "default" });
const loads = new Map<string, Promise<GeneratedHeroArt | undefined>>();

async function load(id: string): Promise<GeneratedHeroArt | undefined> {
  if (id === "kael") {
    const image = await loadKaelSprite();
    return (ctx, pose, look) => drawKaelSprite(ctx, image, pose, look);
  }
  const root = `./assets/${id}`;
  const atlas = atlases[`${root}/atlas.png`];
  const profile = profiles[`${root}/profile.json`];
  if (!atlas || !profile) {
    return undefined;
  }
  const { weaponGrip, weaponTipY, weaponWidth } = profile;
  if (
    !weaponGrip.every(Number.isFinite) ||
    !Number.isFinite(weaponTipY) ||
    !Number.isFinite(weaponWidth) ||
    weaponTipY <= weaponGrip[1] ||
    weaponWidth <= 0
  ) {
    throw new Error(`Invalid weapon art profile: ${id}`);
  }
  const offhand = equipment[`${root}/offhand.png`];
  const [image, item] = await Promise.all([decodeArtImage(atlas), offhand ? decodeArtImage(offhand) : undefined]);
  if (image.naturalWidth !== 265 || image.naturalHeight !== 112) {
    throw new Error(`Unexpected atlas dimensions: ${id}`);
  }
  return createPoseSprite(image, profile, item);
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
