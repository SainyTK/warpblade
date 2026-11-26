import type { Enemy, EnemyType } from "../types/enemy";
import type { SpriteImage } from "../types/sprite";
import { decodeSheet } from "./decode";
import type { FoeArtClip, FoeArtSheet } from "./types";

export type { FoeArtClip, FoeArtSheet } from "./types";

const atlases = import.meta.glob<string>("./assets/*/atlas.png", { eager: true, query: "?url", import: "default" });
const sheets = import.meta.glob<FoeArtSheet>("./assets/*/sheet.json", { eager: true, import: "default" });

interface LoadedArt {
  sheet: FoeArtSheet;
  frames: SpriteImage[];
}

const loaded = new Map<string, LoadedArt>();
const HURT_CLIP = "hurt";
const DEFAULT_CLIP = "idle";
const PHASE_SUFFIX = "@2";

const disabled = (): boolean => new URLSearchParams(location.search).get("foeart") === "off";

export async function preloadFoeArt(): Promise<void> {
  if (disabled()) return;
  await Promise.all(
    Object.entries(sheets).map(async ([path, sheet]) => {
      const type = path.split("/")[2];
      const atlas = atlases[`./assets/${type}/atlas.png`];
      if (!atlas) return;
      try {
        loaded.set(type, { sheet, frames: await decodeSheet(atlas, sheet) });
      } catch {
        loaded.delete(type);
      }
    }),
  );
}

export const hasFoeArt = (type: EnemyType): boolean => loaded.has(type);

function clipFor(e: Enemy, sheet: FoeArtSheet): { clip: FoeArtClip; age: number } | null {
  const hurt = e.stagger > 0 || e.stun > 0 || e.air;
  const names = [
    hurt ? HURT_CLIP : null,
    e.phase > 1 ? `${e.state}${PHASE_SUFFIX}` : null,
    e.state,
    e.phase > 1 ? `${DEFAULT_CLIP}${PHASE_SUFFIX}` : null,
    DEFAULT_CLIP,
  ];
  for (const name of names) {
    if (name && sheet.clips[name])
      return { clip: sheet.clips[name], age: name === DEFAULT_CLIP ? e.seed + e.st : e.st };
  }
  return null;
}

export function foeArtImage(e: Enemy, t: number): SpriteImage | null {
  const art = loaded.get(e.type);
  if (!art) return null;
  const chosen = clipFor(e, art.sheet);
  if (!chosen) return null;
  const { clip, age } = chosen;
  const step = Math.floor(Math.max(0, age || t) * clip.fps);
  const at = clip.loop ? step % clip.frames.length : Math.min(step, clip.frames.length - 1);
  return art.frames[clip.frames[at]] ?? null;
}
