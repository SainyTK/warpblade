import { readFile } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import type { Plugin } from 'vite';
import {
  CLIP_CHANGED,
  type ClipChange,
  DRAFT_CHANGED,
  DRAFTS_WANTED,
  type DraftsWanted,
} from '../../../src/motionClips';
import { DRAFT_FOLDER } from '../../shared/draft';
import { type MotionRef, parseMotionId } from '../../shared/motionId';
import { HEROES_DIR } from '../constants';

const JSON_FILE = '.json';
const HERO_CLIP_FILE = /^([^/]+)\/motion\/(.+)\.json$/;

const slashed = (path: string): string => path.split(sep).join('/');

async function readJson(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, 'utf8'));
  } catch {
    return null;
  }
}

/** The hero and clip of a JSON file under `folder`, laid out as `<hero>/<clip>.json`. */
function motionUnder(folder: string, file: string): MotionRef | null {
  const path = slashed(relative(folder, file));
  return path.endsWith(JSON_FILE) ? parseMotionId(path.slice(0, -JSON_FILE.length)) : null;
}

/**
 * Dev servers only. A changed motion clip file reaches open pages as a CLIP_CHANGED message in place of a reload,
 * and a saved studio draft as DRAFT_CHANGED, so each page swaps only the clip that changed.
 */
export function motionLive(repoRoot: string): Plugin {
  const draftDir = join(repoRoot, 'studio', DRAFT_FOLDER);
  const heroesDir = join(repoRoot, HEROES_DIR);
  const draftChange = async ({ hero, clip }: MotionRef): Promise<ClipChange | null> => {
    const data = await readJson(join(draftDir, hero, `${clip}${JSON_FILE}`));
    return data === null ? null : { hero, clip, data };
  };
  return {
    name: 'warpblade-motion-live',
    apply: 'serve',
    enforce: 'pre',
    configureServer(server) {
      server.watcher.add(draftDir);
      const announce = async (file: string) => {
        const ref = motionUnder(draftDir, file);
        const change = ref && (await draftChange(ref));
        if (change) {
          server.ws.send(DRAFT_CHANGED, change);
        }
      };
      server.watcher.on('add', announce);
      server.watcher.on('change', announce);
      server.ws.on(DRAFTS_WANTED, async ({ hero, clips }: DraftsWanted, client) => {
        for (const clip of clips) {
          const ref = parseMotionId(`${hero}/${clip}`);
          const change = ref && (await draftChange(ref));
          if (change) {
            client.send(DRAFT_CHANGED, change);
          }
        }
      });
    },
    async hotUpdate({ type, file, read, server }) {
      const [, hero, clip] = HERO_CLIP_FILE.exec(slashed(relative(heroesDir, file))) ?? [];
      const ref = hero && clip ? parseMotionId(`${hero}/${clip}`) : null;
      if (type !== 'update' || !ref) {
        return;
      }
      if (this.environment.name === 'client') {
        const data = await Promise.resolve(read())
          .then((text) => JSON.parse(text) as unknown)
          .catch(() => null);
        if (data !== null) {
          server.ws.send(CLIP_CHANGED, { ...ref, data } satisfies ClipChange);
        }
      }
      return [];
    },
  };
}
