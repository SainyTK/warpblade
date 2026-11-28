import { readdir } from "node:fs/promises";
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

/** what the developer is asked to do with QA's blocking issues: fix them, or take out what is still broken */
type Pass = "build" | "fix" | "cut" | "fun";

const FOLLOW_UP: Record<Exclude<Pass, "build">, string> = {
  fix:
    "QA found the blocking issues below. Fix every one of them now, blockers first, and leave everything else as it is, " +
    "check again, commit, and answer with an updated report.",
  cut:
    "QA still finds the blocking issues below after every round of fixes, and the patch ships tonight. Take out the changes " +
    "that cause them (revert or remove that part of the patch) and keep the rest working, check again, commit, " +
    "and answer with an updated report that names what you took out in notDelivered.",
  fun:
    "The patch passed QA, but the Fun benchmark scores it lower than the base build. The dimensions that fell are below, " +
    "with the files that hold the measure readings and the judges' evidence for both builds. Find what in tonight's changes " +
    "lowered them, then fix it or take that part out, keep the rest of the plan working, check again, commit, " +
    "and answer with an updated report.",
};

async function develop(
  night: Night,
  resume: string | null,
  pass: Pass,
  issues: QaReport | null,
): Promise<{ report: DevReport; session: string | null }> {
  const { files, ctx } = night;
  const extra =
    pass === "build" || !issues ? "" : `${FOLLOW_UP[pass]}\n\n${JSON.stringify(blockingIssues(issues), null, 2)}`;
  const prompt = resume
    ? extra
    : await promptFor(
        "developer",
        ctx,
        {
          "The plan": files.plan,
          "Baseline playtest report": files.baseline,
          "Fun score of the base build": files.funScore("base"),
          "Fun measure raw data of the base build": files.fun("base"),
          "Scratch folder": files.scratch,
        },
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
    "Baseline playtest report": files.baseline,
    "Fun measure raw data of the base build": files.fun("base"),
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

/** the issues that hold the patch back; a failed verdict with only minor issues sends them all */
const blockingIssues = (report: QaReport) => {
  const serious = report.issues.filter((i) => i.severity !== "minor");
  return serious.length ? serious : report.issues;
};

async function verify(
  night: Night,
  start: { report: DevReport; session: string | null },
  firstRound: number,
): Promise<{ dev: DevReport; qa: QaReport }> {
  let { report, session } = start;
  let fixes = 0;
  let cut = false;
  for (let round = firstRound; ; round++) {
    const verdict = await qa(night, round);
    if (!blocking(verdict)) return { dev: report, qa: verdict };
    if (cut) {
      throw new Error(
        `QA still blocks the patch after ${fixes} rounds of fixes and the cut round; see ${night.files.qa(round)}`,
      );
    }
    if (fixes < MAX_FIX_ROUNDS) {
      fixes++;
      ({ report, session } = await develop(night, session, "fix", verdict));
      continue;
    }
    cut = true;
    ({ report, session } = await develop(night, session, "cut", verdict));
  }
}

/** build the plan, then let QA check it. The patch ships as soon as QA finds nothing blocking, with any minor issues
    left for the patch notes and the roadmap (owner decision, 18 November 2026: minor fixes cost a round each and
    brought in new majors). Blocking issues go back to the developer for up to MAX_FIX_ROUNDS rounds; one still left
    gets one cut round that takes the broken part out, and the night fails only if QA still blocks after it.
    A resumed night with the developer's report saved starts at QA; its fix rounds start a new developer session */
export async function buildAndVerify(night: Night, built: DevReport | null): Promise<{ dev: DevReport; qa: QaReport }> {
  const start = built ? { report: built, session: null } : await develop(night, null, "build", null);
  return verify(night, start, 0);
}

export async function reworkForFun(night: Night, regression: QaReport): Promise<{ dev: DevReport; qa: QaReport }> {
  const rounds = (await readdir(night.ctx.runDir)).filter((file) => /^qa-\d+\.json$/.test(file)).length;
  return verify(night, await develop(night, null, "fun", regression), rounds);
}
