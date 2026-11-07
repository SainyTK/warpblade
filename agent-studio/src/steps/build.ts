import { MAX_FIX_ROUNDS } from "../constants.ts";
import { promptFor } from "../prompts.ts";
import { writeJson } from "../services/files.ts";
import { headSha } from "../services/git.ts";
import type { DevReport, Night, QaReport } from "../types.ts";
import { callRole } from "./agent.ts";
import { commitLeftovers, discardChanges, guardStep, isProtected } from "./guards.ts";

const DEVELOPER_OWNS = (path: string) =>
  !isProtected(path) &&
  !path.startsWith("agent-studio/") &&
  !path.startsWith("src/content/patches/") &&
  !path.startsWith("public/patches/");

/** what the developer is asked to do with QA's issues: fix blockers and majors, or polish the minor ones */
type Pass = "build" | "fix" | "polish";

const FOLLOW_UP: Record<Exclude<Pass, "build">, string> = {
  fix: "QA failed the patch. Fix every blocker and major issue below, check again, commit, and answer with an updated report.",
  polish:
    "QA passed the patch with the minor issues below. Fix the ones a player would see (text, labels, small visual or feel problems) " +
    "when the fix is small and safe, leave the rest and say why in notDelivered, check again, commit, and answer with an updated report.",
};

async function develop(
  night: Night,
  resume: string | null,
  pass: Pass,
  issues: QaReport | null,
): Promise<{ report: DevReport; session: string | null }> {
  const { files, ctx } = night;
  const extra = pass === "build" || !issues ? "" : `${FOLLOW_UP[pass]}\n\n${JSON.stringify(issues.issues, null, 2)}`;
  const prompt = resume
    ? extra
    : await promptFor(
        "developer",
        ctx,
        { "The plan": files.plan, "Baseline playtest reports": files.baseline, "Scratch folder": files.scratch },
        extra,
      );
  const label = pass === "build" ? "developer" : `developer-${pass}`;
  const { output, sessionId } = await callRole<DevReport>(night, { role: "developer", prompt, label, resume });
  await commitLeftovers(night, "Commit the rest of the developer's work");
  await guardStep(night, ctx.baseSha, DEVELOPER_OWNS, "developer");
  await writeJson(files.develop, output);
  return { report: output, session: sessionId };
}

async function qa(night: Night, round: number): Promise<QaReport> {
  const { files, ctx } = night;
  const head = await headSha(ctx.workdir);
  const prompt = await promptFor("qa", ctx, {
    "The plan": files.plan,
    "Developer report": files.develop,
    "Baseline playtest reports": files.baseline,
    "Scratch folder": files.scratch,
  });
  const { output } = await callRole<QaReport>(night, { role: "qa", prompt, label: `qa-${round}` });
  const edited = await discardChanges(night);
  if ((await headSha(ctx.workdir)) !== head) throw new Error("QA committed to the branch, which it must never do");
  if (edited.length)
    output.issues.push({
      severity: "minor",
      description: `QA edited repo files, which were discarded: ${edited.join(", ")}`,
      reproduce: "",
    });
  await writeJson(files.qa(round), output);
  return output;
}

const blocking = (report: QaReport) => report.issues.some((i) => i.severity !== "minor") || report.verdict === "fail";

/** build the plan, then let QA check it: up to MAX_FIX_ROUNDS rounds of fixes for blocking issues,
    and one polish round for the minor issues of a passing patch, each followed by another QA round.
    A resumed night with the developer's report saved starts at QA; its fix rounds start a new developer session */
export async function buildAndVerify(night: Night, built: DevReport | null): Promise<{ dev: DevReport; qa: QaReport }> {
  let { report, session } = built ? { report: built, session: null } : await develop(night, null, "build", null);
  let fixes = 0;
  let polished = false;
  for (let round = 0; ; round++) {
    const verdict = await qa(night, round);
    if (!blocking(verdict)) {
      if (polished || !verdict.issues.length) return { dev: report, qa: verdict };
      polished = true;
      ({ report, session } = await develop(night, session, "polish", verdict));
      continue;
    }
    if (fixes >= MAX_FIX_ROUNDS) {
      throw new Error(`QA failed the patch after ${MAX_FIX_ROUNDS} rounds of fixes; see ${night.files.qa(round)}`);
    }
    fixes++;
    ({ report, session } = await develop(night, session, "fix", verdict));
  }
}
