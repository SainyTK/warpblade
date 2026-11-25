import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { DRILL_CLIP_IDS, parseClip } from '../../../src/motionClips';
import { DRAFT_FOLDER, type Draft } from '../../shared/draft';
import { type MotionRef, motionId, parseMotionId } from '../../shared/motionId';
import { HEROES_DIR } from '../constants';
import { StudioError } from '../utils/errors';

/** Drafts as JSON files in the studio's data folder, one per clip under a folder per hero. */
export class DraftStore {
  private readonly dir: string;
  private readonly heroesDir: string;

  constructor(studioRoot: string, repoRoot: string) {
    this.dir = join(studioRoot, DRAFT_FOLDER);
    this.heroesDir = join(repoRoot, HEROES_DIR);
  }

  /** The heroes with motion clip files. */
  async heroes(): Promise<string[]> {
    const entries = await readdir(this.heroesDir, { withFileTypes: true });
    const heroes = await Promise.all(
      entries
        .filter((entry) => entry.isDirectory())
        .map(async (entry) =>
          (await readdir(join(this.heroesDir, entry.name))).includes('motion') ? entry.name : null,
        ),
    );
    return heroes.filter((hero) => hero !== null);
  }

  private async ref(id: string): Promise<MotionRef> {
    const ref = parseMotionId(id);
    if (!ref || !(await this.heroes()).includes(ref.hero)) {
      throw new StudioError(404, `No hero has the motion clip ${id}.`);
    }
    return ref;
  }

  private path({ hero, clip }: MotionRef): string {
    return join(this.dir, hero, `${clip}.json`);
  }

  async get(id: string): Promise<Draft | null> {
    const ref = await this.ref(id);
    try {
      const saved = JSON.parse(await readFile(this.path(ref), 'utf8')) as Draft;
      return { ...saved, ...ref };
    } catch {
      return null;
    }
  }

  async list(): Promise<Draft[]> {
    const ids = (await this.heroes()).flatMap((hero) =>
      DRILL_CLIP_IDS.map((clip) => motionId(hero, clip)),
    );
    const drafts = await Promise.all(ids.map((id) => this.get(id)));
    return drafts.filter((draft) => draft !== null);
  }

  async save(id: string, body: unknown): Promise<Draft> {
    const ref = await this.ref(id);
    const { frames, snaps } = (() => {
      try {
        return parseClip(id, body);
      } catch (problem) {
        throw new StudioError(400, problem instanceof Error ? problem.message : 'Not a clip.');
      }
    })();
    const draft: Draft = {
      ...ref,
      updatedAt: new Date().toISOString(),
      frames: [...frames],
      snaps: [...snaps],
    };
    const path = this.path(ref);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, JSON.stringify(draft));
    return draft;
  }
}
