import { join } from "node:path";
import { readText } from "./services/files.ts";
import type { Role, RunContext } from "./types.ts";

/** the role's standing instructions followed by tonight's facts and file paths */
export async function promptFor(
  role: Role,
  ctx: RunContext,
  files: Record<string, string>,
  extra = "",
): Promise<string> {
  const instructions = await readText(join(ctx.workdir, "agent-studio", "roles", `${role}.md`));
  const lines = [
    `- Patch: ${ctx.version}, a ${ctx.kind} patch for ${ctx.date}.`,
    `- Repository checkout (your working directory): ${ctx.workdir}`,
    `- Branch: ${ctx.branch}, started from base commit ${ctx.baseSha}.`,
    `- Last release tag: ${ctx.lastTag ?? "none yet; this is the studio's first patch"}.`,
    `- Run folder for your notes and throwaway scripts: ${ctx.runDir}`,
    ...Object.entries(files).map(([label, path]) => `- ${label}: ${path}`),
  ];
  return `${instructions}\n\n## Tonight's run\n\n${lines.join("\n")}\n${extra ? `\n${extra}\n` : ""}`;
}
