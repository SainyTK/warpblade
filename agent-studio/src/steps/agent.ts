import { MODEL, ROLES, SMALL_PATCH_DEVELOPER_MINUTES, WRAP_UP_MINUTES } from "../constants.ts";
import { NoAnswerError, runAgent } from "../services/claude.ts";
import { schemaText } from "../services/schemas.ts";
import type { AgentResult, Night, Role } from "../types.ts";

/** what a resumed agent is told after it stopped before its answer */
const RESUME_PROMPT = {
  interrupted:
    "Your session stopped before you gave your structured answer, most likely because the Mac slept or the process was stopped. " +
    "Commands you left running in the background were stopped too. Check where the work stands, finish what is left, " +
    "and give your structured answer.",
  timedOut:
    "Your time is up. Start no new work: commit what is finished, note what is not in your report, and give your structured answer now.",
};

interface RoleCall {
  role: Role;
  prompt: string;
  /** a label for logs and costs when a role runs more than once */
  label?: string;
  resume?: string | null;
}

/** run one role's agent in the checkout, with the run folder open to it, and record its cost.
    An agent that stops before its answer is resumed once in the same session */
export async function callRole<T>(night: Night, call: RoleCall): Promise<{ output: T; sessionId: string | null }> {
  const config = ROLES[call.role];
  const label = call.label ?? call.role;
  const small = night.ctx.kind === "small" && call.role === "developer";
  const minutes = small ? SMALL_PATCH_DEVELOPER_MINUTES : config.minutes;
  const schema = await schemaText(config.schema);
  const run = (prompt: string, resume: string | null | undefined, limit: number) =>
    runAgent<T>({
      name: `warpblade ${night.ctx.version} ${label}`,
      prompt,
      cwd: night.ctx.workdir,
      config,
      minutes: limit,
      schema,
      logPath: night.files.agentLog(label),
      addDirs: [night.ctx.runDir],
      resume,
    });
  console.log(`[studio] ${label} started (${MODEL})`);
  let result: AgentResult<T>;
  try {
    result = await run(call.prompt, call.resume, minutes);
  } catch (error) {
    if (!(error instanceof NoAnswerError && error.sessionId)) throw error;
    console.log(`[studio] ${label} stopped before its answer (${error.message}); resuming its session`);
    result = error.timedOut
      ? await run(RESUME_PROMPT.timedOut, error.sessionId, WRAP_UP_MINUTES)
      : await run(RESUME_PROMPT.interrupted, error.sessionId, minutes);
  }
  const before = call.resume ? (night.sessionTotals[call.resume] ?? 0) : 0;
  const spent = Math.max(0, result.costUsd - before);
  if (result.sessionId) night.sessionTotals[result.sessionId] = result.costUsd;
  night.costs[label] = (night.costs[label] ?? 0) + spent;
  console.log(`[studio] ${label} finished ($${spent.toFixed(2)})`);
  return { output: result.output, sessionId: result.sessionId };
}
