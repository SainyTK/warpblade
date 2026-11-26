import { clipsFromEntries, parseClip } from "../motionClips";
import { followMotion } from "../services/liveMotion";
import type { DrillClips, PoseClip } from "../types/motionClip";
import type { HeroId } from "./roster";

const FILE = /^\.\/([^/]+)\/motion\/(.+)\.json$/;
const files = import.meta.glob<unknown>("./*/motion/**/*.json", { eager: true, import: "default" });

function readFiles(): Record<string, Record<string, PoseClip>> {
  const heroes: Record<string, Record<string, PoseClip>> = {};
  for (const [path, data] of Object.entries(files)) {
    const [, hero, clip] = FILE.exec(path) ?? [];
    if (hero && clip) {
      heroes[hero] ??= {};
      heroes[hero][clip] = parseClip(`src/heroes/${hero}/motion/${clip}.json`, data);
    }
  }
  return heroes;
}

/** every hero's drill motion clips, read from `src/heroes/<id>/motion/` */
export const HERO_CLIPS = Object.fromEntries(
  Object.entries(readFiles()).map(([hero, entries]) => [hero, clipsFromEntries(entries, hero)]),
) as Readonly<Record<HeroId, DrillClips>>;

/** the hero's clips for its drill profile; a dev build swaps each one in place when its file changes */
export function heroClips(hero: HeroId): DrillClips {
  const clips = HERO_CLIPS[hero];
  followMotion(hero, clips);
  return clips;
}
