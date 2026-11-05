import { basename, dirname, join } from "node:path";

/** where each step of a night keeps its files, inside the run folder */
export function runFiles(runDir: string) {
  return {
    context: join(runDir, "context.json"),
    commits: join(runDir, "commits.txt"),
    /** raw player feedback, kept outside the run folder that agents are pointed at */
    feedback: join(dirname(runDir), ".feedback", `${basename(runDir)}.json`),
    triage: join(runDir, "triage.json"),
    baseline: join(runDir, "baseline"),
    plan: join(runDir, "plan.json"),
    develop: join(runDir, "develop.json"),
    qa: (round: number) => join(runDir, `qa-${round}.json`),
    media: join(runDir, "media.json"),
    releaseAssets: join(runDir, "release-assets"),
    diff: join(runDir, "diff.patch"),
    write: join(runDir, "write.json"),
    releaseNotes: join(runDir, "release-notes.md"),
    prBody: join(runDir, "pr-body.md"),
    feedbackChanges: join(runDir, "feedback-changes.json"),
    publish: join(runDir, "publish.json"),
    review: join(runDir, "review.md"),
    summary: join(runDir, "summary.json"),
    checksLog: join(runDir, "logs", "checks.log"),
    agentLog: (name: string) => join(runDir, "logs", `${name}.jsonl`),
    scratch: join(runDir, "scratch"),
  };
}

export type RunFiles = ReturnType<typeof runFiles>;
