import { decodeArtImage } from "./image";

const files = import.meta.glob<string>("./assets/*/portrait.webp", { eager: true, query: "?url", import: "default" });
const loaded = new Map<string, Promise<string | undefined>>();

export function loadGeneratedHeroPortrait(id: string): Promise<string | undefined> {
  const cached = loaded.get(id);
  if (cached) {
    return cached;
  }
  const url = files[`./assets/${id}/portrait.webp`];
  const pending = url ? decodeArtImage(url).then((image) => image.src) : Promise.resolve(undefined);
  loaded.set(id, pending);
  return pending;
}
