// Writes the studio's drafts into the heroes' motion clips: npm run apply-motion -- [hero/clip...]
// With no clip named, every draft that differs from the game is written.
import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { formatClip } from '../../src/motionClips';
import { configuration } from './config';
import { heroMotionDir } from './constants';
import { DraftStore } from './services/drafts';

const config = configuration();
const store = new DraftStore(config.studioRoot, config.repoRoot);
const named = process.argv.slice(2);
const drafts = named.length
  ? await Promise.all(
      named.map(async (id) => {
        const draft = await store.get(id);
        if (!draft) {
          throw new Error(`The studio has no draft of ${id}.`);
        }
        return draft;
      }),
    )
  : await store.list();

let written = 0;
for (const draft of drafts) {
  const id = `${draft.hero}/${draft.clip}`;
  const path = join(config.repoRoot, heroMotionDir(draft.hero), `${draft.clip}.json`);
  const text = formatClip(draft);
  if (text === (await readFile(path, 'utf8'))) {
    console.log(`${id}: already in the game`);
    continue;
  }
  await writeFile(path, text);
  written += 1;
  console.log(`${id}: ${draft.frames.length} frames written (draft saved ${draft.updatedAt})`);
}
console.log(
  written ? `${written} clips written to the heroes' motion folders` : 'Nothing to write.',
);
