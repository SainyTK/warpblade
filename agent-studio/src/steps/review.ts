import { readdir } from "node:fs/promises";
import { join } from "node:path";
import type { Patch } from "../../../src/types/patch.ts";
import { readJson, readText, writeText } from "../services/files.ts";
import { git } from "../services/git.ts";
import type {
  AnalystReport,
  DevReport,
  FeedbackIssue,
  MediaItem,
  Night,
  Plan,
  QaReport,
  TriageItem,
} from "../types.ts";
import type { FeedbackChange } from "../utils/feedbackOutcome.ts";
import type { BuildScore } from "./fun.ts";

const optional = <T>(path: string) => readJson<T>(path).catch(() => null);

const cell = (text: string) => text.replaceAll("|", "/").replaceAll("\n", " ");

function triageTable(items: TriageItem[], raw: FeedbackIssue[]): string[] {
  if (!items.length) return ["No open feedback tonight."];
  const message = new Map(raw.map((f) => [f.id, `${f.title}: ${f.body}`]));
  const rows = items.map(
    (t) =>
      `| #${t.id} | ${cell(message.get(t.id) ?? "")} | ${t.decision} | ${t.weight} | ${cell(t.reason)} | ${cell(t.reply)} |`,
  );
  return [
    "| Item | Player wrote | Decision | Weight | Studio reason | Reply to the player |",
    "| --- | --- | --- | --- | --- | --- |",
    ...rows,
  ];
}

function planLines(plan: Plan): string[] {
  const lines = [`Theme: ${plan.theme}`, ""];
  if (plan.headline) {
    lines.push(
      `### Headline: ${plan.headline.name} (${plan.headline.category})`,
      "",
      plan.headline.pitch,
      "",
      "Acceptance checks:",
      "",
    );
    lines.push(
      ...plan.headline.acceptance.map((a) => `- ${a}`),
      "",
      "<details><summary>Full design</summary>",
      "",
      plan.headline.design,
      "",
      "</details>",
      "",
    );
  }
  lines.push("### Changes", "");
  lines.push(
    ...plan.changes.map((c) => `- ${c.type}, ${c.target}: ${c.change} Reason: ${c.reason} Evidence: ${c.evidence}`),
  );
  lines.push("", "### Considered and set aside", "", ...plan.considered.map((c) => `- ${c.idea}: ${c.whyNot}`));
  return lines;
}

interface FunRun {
  cpu: { budgetCores: number; averageCores: number; peakCores: number; pausedSeconds: number };
}

function cpuLine(build: string, run: FunRun | null): string[] {
  if (!run) return [];
  const { cpu } = run;
  return [
    `- CPU on the ${build} build: average ${cpu.averageCores} cores, busiest 5 seconds ${cpu.peakCores}, budget ${cpu.budgetCores}, paused ${cpu.pausedSeconds} s.`,
  ];
}

function funLines(
  base: BuildScore | null,
  patch: BuildScore | null,
  analysis: AnalystReport | null,
  runs: [FunRun | null, FunRun | null],
): string[] {
  if (!base && !patch) return ["Not scored."];
  const picks = analysis?.picks.map(
    (p) => `${p.id} (${[...p.sample.heroes, ...p.sample.stages].join(", ") || "default sample"})`,
  );
  const ids = Object.keys(patch?.dimensions ?? base?.dimensions ?? {});
  const value = (score: BuildScore | null, id: string) => (score?.dimensions[id] ?? "-").toString();
  return [
    `Fun: base ${base?.fun ?? "-"}, patch ${patch?.fun ?? "-"}. Judges' gut scores: base ${base?.gut.join(", ") ?? "-"}, patch ${patch?.gut.join(", ") ?? "-"}.`,
    "",
    "| Dimension | Base | Patch |",
    "| --- | --- | --- |",
    ...ids.map((id) => `| ${id} | ${value(base, id)} | ${value(patch, id)} |`),
    "",
    ...[...(base?.failures ?? []), ...(patch?.failures ?? [])].map((f) => `- Measurement problem: ${f}`),
    ...(patch?.missing.length ? [`- Not measured on the patch: ${patch.missing.join(", ")}`] : []),
    `- Measured tonight: ${picks?.join("; ") ?? "nothing"}. Carried over from the ledger: ${patch?.carried.length ?? 0} readings.`,
    ...cpuLine("base", runs[0]),
    ...cpuLine("patch", runs[1]),
  ];
}

async function lastQa(runDir: string): Promise<QaReport | null> {
  const rounds = (await readdir(runDir)).filter((f) => /^qa-\d+\.json$/.test(f)).sort();
  const last = rounds.at(-1);
  return last ? readJson<QaReport>(join(runDir, last)) : null;
}

/** one Markdown page with every decision of the night, for the owner to review */
export async function writeReview(night: Night, outcome: string): Promise<void> {
  const { files, ctx } = night;
  const plan = await optional<Plan>(files.plan);
  const triage = (await optional<TriageItem[]>(files.triage)) ?? [];
  const raw = (await optional<FeedbackIssue[]>(files.feedback)) ?? [];
  const dev = await optional<DevReport>(files.develop);
  const qa = await lastQa(ctx.runDir);
  const media = (await optional<MediaItem[]>(files.media)) ?? [];
  const changes = (await optional<FeedbackChange[]>(files.feedbackChanges)) ?? [];
  const notes = await readText(files.releaseNotes).catch(() => "Not written.");
  const funBase = await optional<BuildScore>(files.funScore("base"));
  const funPatch = await optional<BuildScore>(files.funScore("final"));
  const analysis = await optional<AnalystReport>(files.funAnalysis);
  const funRuns: [FunRun | null, FunRun | null] = [
    await optional<FunRun>(join(files.fun("base"), "measurement.json")),
    await optional<FunRun>(join(files.fun(funPatch?.build ?? "patch"), "measurement.json")),
  ];
  const patch = await optional<Patch>(join(ctx.workdir, "src", "content", "patches", `${ctx.version}.json`));
  const stat = await git(ctx.workdir, "diff", "--stat", `${ctx.baseSha}..HEAD`).catch(() => "");
  const cost = Object.entries(night.costs).map(([role, usd]) => `| ${role} | $${usd.toFixed(2)} |`);
  const lines = [
    `# Patch ${ctx.version}${patch ? `: ${patch.title}` : ""} (${ctx.mode} run)`,
    "",
    `${ctx.kind === "big" ? "Big" : "Small"} patch for ${ctx.date}. Outcome: ${outcome}`,
    "",
    `Branch \`${ctx.branch}\` in \`${ctx.workdir}\`, from base \`${ctx.baseSha.slice(0, 7)}\`.`,
    `To play it: \`cd ${ctx.workdir} && npm run dev\`, then open the game at / and the notes at /patches/.`,
    "",
    "## Feedback triage",
    "",
    ...triageTable(triage, raw),
    "",
    "## Fun score",
    "",
    ...funLines(funBase, funPatch, analysis, funRuns),
    "",
    "## The director's decision",
    "",
    plan ? plan.memo : "No plan.",
    "",
    ...(plan ? planLines(plan) : []),
    "",
    "## What the developer built",
    "",
    dev ? dev.summary : "Not built.",
    "",
    ...(dev?.notDelivered.map((n) => `- Not delivered: ${n.item}. ${n.why}`) ?? []),
    ...(dev?.knownIssues.map((k) => `- Known issue: ${k}`) ?? []),
    "",
    "## QA",
    "",
    qa ? `Verdict: ${qa.verdict}` : "No QA run.",
    "",
    ...(qa?.checks.map((c) => `- ${c.result}: ${c.name}. ${c.evidence}`) ?? []),
    ...(qa?.issues.map((i) => `- Issue (${i.severity}): ${i.description}`) ?? []),
    "",
    "## Media",
    "",
    ...(media.length ? media.map((m) => `- ${m.kind} \`${m.file}\`: ${m.alt}`) : ["None."]),
    "",
    "## Feedback changes",
    "",
    ...(changes.length
      ? changes.map((c) => `- #${c.id}: ${c.action}${c.reply ? `, comment: ${c.reply}` : ""}`)
      : ["None."]),
    "",
    "## Files changed",
    "",
    "```text",
    stat,
    "```",
    "",
    "## Agent cost",
    "",
    "| Role | Cost |",
    "| --- | --- |",
    ...cost,
    "",
    "## Release notes preview",
    "",
    notes,
  ];
  await writeText(files.review, `${lines.join("\n")}\n`);
}
