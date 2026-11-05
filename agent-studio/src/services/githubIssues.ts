import { FEEDBACK_LABEL } from "../../../src/constants/feedback.ts";
import { FEEDBACK_BODY_MAX, FEEDBACK_LIMIT, PLANNED_LABEL, REPO_SLUG } from "../constants.ts";
import type { FeedbackIssue } from "../types.ts";
import type { FeedbackChange } from "../utils/feedbackOutcome.ts";
import { run } from "./shell.ts";

/** the fields `gh issue list --json` returns that the studio reads */
interface IssueRow {
  number: number;
  title: string;
  body: string;
  createdAt: string;
  labels: { name: string }[];
  reactionGroups: { content: string; users: { totalCount: number } }[];
}

const gh = (cwd: string, args: string[]) => run("gh", [...args, "--repo", REPO_SLUG], { cwd });

/** open game-feedback issues, oldest first */
export async function openFeedback(cwd: string): Promise<FeedbackIssue[]> {
  const fields = "number,title,body,createdAt,labels,reactionGroups";
  const args = [
    "issue",
    "list",
    "--label",
    FEEDBACK_LABEL,
    "--state",
    "open",
    "--limit",
    String(FEEDBACK_LIMIT),
    "--json",
    fields,
  ];
  const rows = JSON.parse(await gh(cwd, args)) as IssueRow[];
  return rows
    .map((row) => ({
      id: row.number,
      title: row.title,
      body: row.body.slice(0, FEEDBACK_BODY_MAX),
      votes: row.reactionGroups.find((g) => g.content === "THUMBS_UP")?.users.totalCount ?? 0,
      planned: row.labels.some((l) => l.name === PLANNED_LABEL),
      createdAt: row.createdAt,
    }))
    .sort((a, b) => a.id - b.id);
}

/** make sure the labels the studio uses exist; --force leaves existing ones in place with these colours */
export async function ensureLabels(cwd: string): Promise<void> {
  await gh(cwd, [
    "label",
    "create",
    FEEDBACK_LABEL,
    "--color",
    "7fe3ff",
    "--description",
    "Player feedback on the game",
    "--force",
  ]);
  await gh(cwd, [
    "label",
    "create",
    PLANNED_LABEL,
    "--color",
    "e0ac48",
    "--description",
    "The studio plans to do this",
    "--force",
  ]);
}

/** answer one feedback issue on GitHub: a comment, then a label, a close or a lock */
export async function applyFeedback(cwd: string, change: FeedbackChange): Promise<void> {
  const id = String(change.id);
  if (change.action === "addressed") {
    await gh(cwd, ["issue", "close", id, "--reason", "completed", "--comment", change.reply]);
  } else if (change.action === "skipped") {
    await gh(cwd, ["issue", "close", id, "--reason", "not planned", "--comment", change.reply]);
  } else if (change.action === "duplicate") {
    await gh(cwd, [
      "issue",
      "close",
      id,
      "--reason",
      "duplicate",
      "--duplicate-of",
      String(change.duplicateOf),
      "--comment",
      change.reply,
    ]);
  } else if (change.action === "hidden") {
    await gh(cwd, ["issue", "close", id, "--reason", "not planned"]);
    await gh(cwd, ["issue", "lock", id, "--reason", "spam"]);
  } else {
    await gh(cwd, ["issue", "edit", id, "--add-label", PLANNED_LABEL]);
    await gh(cwd, ["issue", "comment", id, "--body", change.reply]);
  }
}
