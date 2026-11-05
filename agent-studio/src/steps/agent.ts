import { MODEL, ROLES, SMALL_PATCH_DEVELOPER_MINUTES } from "../constants.ts";
import { runAgent } from "../services/claude.ts";
import { schemaText } from "../services/schemas.ts";
import type { Night, Role } from "../types.ts";

interface RoleCall {
  role: Role;
  prompt: string;
  /** a label for logs and costs when a role runs more than once */
  label?: string;
  resume?: string | null;
}

/** run one role's agent in the checkout, with the run folder open to it, and record its cost */
export async function callRole<T>(night: Night, call: RoleCall): Promise<{ output: T; sessionId: string | null }> {
  const config = ROLES[call.role];
  const label = call.label ?? call.role;
  const small = night.ctx.kind === "small" && call.role === "developer";
  console.log(`[studio] ${label} started (${MODEL})`);
  const result = await runAgent<T>({
    name: `warpblade ${night.ctx.version} ${label}`,
    prompt: call.prompt,
    cwd: night.ctx.workdir,
    config,
    minutes: small ? SMALL_PATCH_DEVELOPER_MINUTES : config.minutes,
    schema: await schemaText(config.schema),
    logPath: night.files.agentLog(label),
    addDirs: [night.ctx.runDir],
    resume: call.resume,
  });
  night.costs[label] = (night.costs[label] ?? 0) + result.costUsd;
  console.log(`[studio] ${label} finished ($${result.costUsd.toFixed(2)})`);
  return { output: result.output, sessionId: result.sessionId };
}
