import { promptFor } from "../prompts.ts";
import { writeJson } from "../services/files.ts";
import type { Night, Plan } from "../types.ts";
import { callRole } from "./agent.ts";

/** the director chooses tonight's content and writes the decision memo */
export async function direct(night: Night): Promise<Plan> {
  const { files, ctx } = night;
  const prompt = await promptFor("director", ctx, {
    "Run context": files.context,
    "Triaged feedback (empty when none)": files.triage,
    "Baseline playtest reports (smoke and bots on the base version)": files.baseline,
    "Commits since the last release": files.commits,
    "Shipped patches": `${ctx.workdir}/src/content/patches/`,
  });
  const { output } = await callRole<Plan>(night, { role: "director", prompt });
  if (output.kind !== ctx.kind)
    throw new Error(`The director planned a ${output.kind} patch, but tonight is a ${ctx.kind} patch`);
  if (ctx.kind === "big" && !output.headline) throw new Error("The director planned a big patch without a headline");
  if (ctx.kind === "small" && output.headline) throw new Error("The director planned new content in a small patch");
  await writeJson(files.plan, output);
  return output;
}
