import { spawn } from "node:child_process";
import { createWriteStream, existsSync, statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { AGENT_CLOCK_TICK_MS, CLAUDE_BIN, MODEL } from "../constants.ts";
import type { AgentResult, RoleConfig } from "../types.ts";
import { awakeMs } from "../utils/awakeTime.ts";

interface AgentCall {
  name: string;
  prompt: string;
  cwd: string;
  config: RoleConfig;
  minutes: number;
  /** JSON schema text for the structured answer */
  schema: string;
  logPath: string;
  /** extra folders the agent may read and write */
  addDirs: string[];
  /** continue an earlier session of the same role */
  resume?: string | null;
}

function argsFor(call: AgentCall): string[] {
  const args = ["-p", "--model", MODEL, "--output-format", "stream-json", "--verbose", "--strict-mcp-config"];
  args.push("--permission-mode", call.config.permission, "--json-schema", call.schema, "--name", call.name);
  if (call.config.tools !== "default") args.push("--tools", call.config.tools.join(","));
  if (call.config.tools !== "default" && call.config.tools.length) args.push("--allowedTools", ...call.config.tools);
  for (const dir of call.addDirs) args.push("--add-dir", dir);
  if (call.resume) args.push("--resume", call.resume);
  args.push("--", call.prompt);
  return args;
}

interface ResultEvent {
  type: "result";
  is_error?: boolean;
  session_id?: string;
  structured_output?: unknown;
  result?: string;
  total_cost_usd?: number;
}

/** an agent that stopped before its structured answer; its session can be resumed when it has one */
export class NoAnswerError extends Error {
  constructor(
    message: string,
    readonly sessionId: string | null,
    readonly timedOut: boolean,
  ) {
    super(message);
  }
}

/** the result events this call wrote to a stream-json log, from the byte where it started, and its session */
async function readLog(logPath: string, from: number): Promise<{ results: ResultEvent[]; sessionId: string | null }> {
  const results: ResultEvent[] = [];
  let sessionId: string | null = null;
  for (const line of (await readFile(logPath)).subarray(from).toString("utf8").split("\n")) {
    if (!line.startsWith("{")) continue;
    try {
      const event = JSON.parse(line) as { type?: string; session_id?: string };
      if (event.session_id) sessionId = event.session_id;
      if (event.type === "result") results.push(event as ResultEvent);
    } catch {
      // a partial line from a killed run
    }
  }
  return { results, sessionId };
}

/** a session can wake up after its answer and end on a plain-text reply,
    so the answer is the latest structured one and the cost is the session's last total */
function answerOf(results: ResultEvent[]): { answer: ResultEvent; costUsd: number } | null {
  const answer = results.findLast((r) => !r.is_error && r.structured_output !== undefined);
  if (!answer) return null;
  return { answer, costUsd: results.at(-1)?.total_cost_usd ?? answer.total_cost_usd ?? 0 };
}

/** run one headless Claude Code agent to its structured answer, or throw a NoAnswerError.
    Its time limit counts only the time the Mac is awake */
export function runAgent<T>(call: AgentCall): Promise<AgentResult<T>> {
  return new Promise((resolve, reject) => {
    // the log is appended to, so only what this call writes is read back
    const from = existsSync(call.logPath) ? statSync(call.logPath).size : 0;
    const log = createWriteStream(call.logPath, { flags: "a" });
    const child = spawn(CLAUDE_BIN, argsFor(call), {
      cwd: call.cwd,
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    });
    child.stdout.pipe(log, { end: false });
    child.stderr.pipe(log, { end: false });
    const limit = call.minutes * 60 * 1000;
    let used = 0;
    let checked = Date.now();
    let timedOut = false;
    const clock = setInterval(() => {
      const now = Date.now();
      used += awakeMs(checked, now, AGENT_CLOCK_TICK_MS);
      checked = now;
      if (used < limit || !child.pid) return;
      timedOut = true;
      clearInterval(clock);
      process.kill(-child.pid, "SIGTERM");
    }, AGENT_CLOCK_TICK_MS);
    child.on("error", (error) => {
      clearInterval(clock);
      reject(error);
    });
    child.on("close", async (code) => {
      clearInterval(clock);
      // read the log only after every byte has reached the file
      await new Promise<void>((done) => log.end(done));
      const { results, sessionId } = await readLog(call.logPath, from);
      const found = answerOf(results);
      if (!found) {
        const why = timedOut
          ? `ran past its ${call.minutes} minutes`
          : `ended without a structured answer (exit ${code})`;
        reject(new NoAnswerError(`${call.name} ${why}; see ${call.logPath}`, sessionId, timedOut));
        return;
      }
      resolve({
        sessionId: found.answer.session_id ?? null,
        output: found.answer.structured_output as T,
        costUsd: found.costUsd,
      });
    });
  });
}
