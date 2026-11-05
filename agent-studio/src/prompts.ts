import { join } from "node:path";
import { readText } from "./services/files.ts";
import type { Role, RunContext } from "./types.ts";

/** the owner's work on main since the last release, which tonight's patch ships and writes up */
function dayWorkLines(ctx: RunContext): string[] {
  const { headlines, feedback } = ctx.dayWork;
  if (!headlines.length && !feedback.length) return [];
  return [
    "- Day work: the owner already built and merged these on main since the last release. They ship in tonight's patch and the notes cover them.",
    ...headlines.map((h) => `  - Headline (${h.category}): ${h.sha} ${h.subject}`),
    ...(feedback.length ? [`  - Feedback addressed by day work: ${feedback.map((id) => `#${id}`).join(", ")}`] : []),
  ];
}

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
    ...dayWorkLines(ctx),
    ...Object.entries(files).map(([label, path]) => `- ${label}: ${path}`),
  ];
  return `${instructions}\n\n## Tonight's run\n\n${lines.join("\n")}\n${extra ? `\n${extra}\n` : ""}`;
}
