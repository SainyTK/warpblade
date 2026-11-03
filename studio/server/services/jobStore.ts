import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { TimelineItem } from '../../shared/api';
import type { JobRecord } from '../types/job';
import { StudioError } from '../utils/errors';
import { ID_PATTERN } from '../utils/ids';

const MEDIA_NAME = /^[a-z0-9-]{1,80}\.(png|jpg|gif|webp)$/;
const MEDIA_TYPE: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
};

/**
 * Each job's folder in the data directory: job.json, timeline.json, the sketch exports the agent reads,
 * and media (images from tool results) the page shows.
 */
export class JobStore {
  readonly root: string;

  constructor(dataDir: string) {
    this.root = join(dataDir, 'jobs');
  }

  dir(id: string): string {
    if (!ID_PATTERN.test(id)) {
      throw new StudioError(404, 'Unknown job.');
    }
    return join(this.root, id);
  }

  exportsDir(id: string): string {
    return join(this.dir(id), 'exports');
  }

  async create(record: JobRecord): Promise<void> {
    await mkdir(join(this.dir(record.id), 'media'), { recursive: true });
    await mkdir(this.exportsDir(record.id), { recursive: true });
    await this.saveRecord(record);
  }

  async saveRecord(record: JobRecord): Promise<void> {
    await writeFile(join(this.dir(record.id), 'job.json'), JSON.stringify(record, null, 2));
  }

  async records(): Promise<JobRecord[]> {
    await mkdir(this.root, { recursive: true });
    const ids = (await readdir(this.root)).filter((id) => ID_PATTERN.test(id));
    const records = await Promise.all(
      ids.map(async (id) => {
        try {
          return JSON.parse(await readFile(join(this.root, id, 'job.json'), 'utf8')) as JobRecord;
        } catch {
          return null;
        }
      }),
    );
    return records.filter((record): record is JobRecord => record !== null);
  }

  async timeline(id: string): Promise<TimelineItem[]> {
    try {
      return JSON.parse(await readFile(join(this.dir(id), 'timeline.json'), 'utf8'));
    } catch {
      return [];
    }
  }

  async saveTimeline(id: string, items: TimelineItem[]): Promise<void> {
    await writeFile(join(this.dir(id), 'timeline.json'), JSON.stringify(items));
  }

  async writeExport(id: string, name: string, data: Buffer | string): Promise<string> {
    const path = join(this.exportsDir(id), name);
    await writeFile(path, data);
    return path;
  }

  /** Saves an image under media/ and returns its file name. */
  async saveMedia(id: string, name: string, data: Buffer): Promise<void> {
    if (!MEDIA_NAME.test(name)) {
      throw new StudioError(400, 'Bad media name.');
    }
    await writeFile(join(this.dir(id), 'media', name), data);
  }

  async readMedia(id: string, name: string): Promise<{ mediaType: string; data: Buffer }> {
    const match = MEDIA_NAME.exec(name);
    const mediaType = match?.[1] ? MEDIA_TYPE[match[1]] : undefined;
    if (!mediaType) {
      throw new StudioError(404, 'Not found.');
    }
    try {
      return { mediaType, data: await readFile(join(this.dir(id), 'media', name)) };
    } catch {
      throw new StudioError(404, 'Not found.');
    }
  }
}
