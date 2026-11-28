import { mkdir, rm } from "node:fs/promises";
import { join } from "node:path";
import { writeJson } from "../../services/files";
import type { EvidenceItem, JobRunner } from "../types";
import { buildScenes } from "./buildScenes";
import { CLIPS_DIR, INDEX_FILE, STILLS_DIR } from "./constants";
import { createAlbum } from "./createAlbum";
import { planShots } from "./planShots";

async function freshFolders(outDir: string): Promise<void> {
  for (const folder of [STILLS_DIR, CLIPS_DIR]) {
    await rm(join(outDir, folder), { recursive: true, force: true });
    await mkdir(join(outDir, folder), { recursive: true });
  }
}

export const runEvidence: JobRunner = async (job, context) => {
  await freshFolders(context.outDir);
  const plan = planShots(job.measures);
  const evidence: EvidenceItem[] = [];
  const notes: string[] = [];
  for (const scene of buildScenes(plan, job.sample)) {
    const album = createAlbum(context.outDir, scene.name);
    try {
      await scene.run(context.harness, album);
    } catch (error) {
      album.note(`failed: ${error instanceof Error ? error.message.split("\n")[0] : String(error)}`);
    }
    evidence.push(...album.items());
    notes.push(...album.notes());
  }
  await writeJson(join(context.outDir, INDEX_FILE), { job, items: evidence, notes });
  return { readings: [], evidence };
};
