import { access } from "node:fs/promises";
import { basename, join } from "node:path";
import { promptFor } from "../prompts.ts";
import { writeJson } from "../services/files.ts";
import { headSha } from "../services/git.ts";
import type { MediaItem, Night, Plan } from "../types.ts";
import { callRole } from "./agent.ts";
import { commitLeftovers, guardStep } from "./guards.ts";

const exists = (path: string) =>
  access(path).then(
    () => true,
    () => false,
  );

/** capture the clips and stills the plan asks for into public/patches/<version>/ */
export async function captureMedia(night: Night, plan: Plan): Promise<MediaItem[]> {
  const { files, ctx } = night;
  if (!plan.media.length) {
    await writeJson(files.media, []);
    return [];
  }
  const since = await headSha(ctx.workdir);
  const folder = `public/patches/${ctx.version}/`;
  const prompt = await promptFor("media", ctx, {
    "The plan": files.plan,
    "Developer report": files.develop,
    "Scratch folder": files.scratch,
    "Media folder in the repo": join(ctx.workdir, folder),
    "Release GIF folder": files.releaseAssets,
  });
  const { output } = await callRole<{ items: MediaItem[] }>(night, { role: "media", prompt });
  await guardStep(night, since, (p) => p.startsWith(folder), "media");
  // agents sometimes answer with the repo path; the patch file wants the bare file name
  const items = output.items.map((item) => ({
    ...item,
    file: basename(item.file),
    poster: item.poster ? basename(item.poster) : null,
  }));
  for (const item of items) {
    const wanted = [
      join(ctx.workdir, folder, item.file),
      ...(item.poster ? [join(ctx.workdir, folder, item.poster)] : []),
    ];
    for (const path of wanted) {
      if (!(await exists(path))) throw new Error(`The media step listed ${path}, which does not exist`);
    }
  }
  await commitLeftovers(night, `Add the clips and stills for Patch ${ctx.version}`);
  await writeJson(files.media, items);
  return items;
}
