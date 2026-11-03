import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Sketch, SketchSummary } from '../../shared/sketch';
import { StudioError } from '../utils/errors';
import { ID_PATTERN } from '../utils/ids';

/** Sketches as JSON files in the studio's data folder, one per sketch. */
export class SketchStore {
  private readonly dir: string;

  constructor(dataDir: string) {
    this.dir = join(dataDir, 'sketches');
  }

  private path(id: string): string {
    if (!ID_PATTERN.test(id)) {
      throw new StudioError(400, 'Unknown sketch.');
    }
    return join(this.dir, `${id}.json`);
  }

  async list(): Promise<SketchSummary[]> {
    await mkdir(this.dir, { recursive: true });
    const files = (await readdir(this.dir)).filter((file) => file.endsWith('.json'));
    const sketches = await Promise.all(
      files.map(async (file) => JSON.parse(await readFile(join(this.dir, file), 'utf8')) as Sketch),
    );
    return sketches
      .map(({ id, name, updatedAt }) => ({ id, name, updatedAt }))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async get(id: string): Promise<Sketch> {
    try {
      return JSON.parse(await readFile(this.path(id), 'utf8')) as Sketch;
    } catch {
      throw new StudioError(404, 'Unknown sketch.');
    }
  }

  async save(sketch: Sketch): Promise<SketchSummary> {
    const saved = { ...sketch, updatedAt: new Date().toISOString() };
    await mkdir(this.dir, { recursive: true });
    await writeFile(this.path(sketch.id), JSON.stringify(saved));
    return { id: saved.id, name: saved.name, updatedAt: saved.updatedAt };
  }

  async remove(id: string): Promise<void> {
    await rm(this.path(id), { force: true });
  }
}
