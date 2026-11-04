import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { CLAUDE_BIN, MODEL } from "../constants.ts";
import type { AgentResult, RoleConfig } from "../types.ts";

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

/** the final result event of a stream-json log */
async function readResult(logPath: string): Promise<ResultEvent | null> {
  const lines = (await readFile(logPath, "utf8")).split("\n");
  for (const line of lines.reverse()) {
    if (!line.startsWith("{")) continue;
    try {
      const event = JSON.parse(line) as { type?: string };
      if (event.type === "result") return event as ResultEvent;
    } catch {
      // a partial line from a killed run
    }
  }
  return null;
}

/** run one headless Claude Code agent to its structured answer, or throw */
export function runAgent<T>(call: AgentCall): Promise<AgentResult<T>> {
  return new Promise((resolve, reject) => {
    const log = createWriteStream(call.logPath, { flags: "a" });
    const child = spawn(CLAUDE_BIN, argsFor(call), {
      cwd: call.cwd,
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    });
    child.stdout.pipe(log, { end: false });
    child.stderr.pipe(log, { end: false });
    const timer = setTimeout(
      () => {
        if (child.pid) process.kill(-child.pid, "SIGTERM");
      },
      call.minutes * 60 * 1000,
    );
    child.on("error", reject);
    child.on("close", async (code) => {
      clearTimeout(timer);
      // read the log only after every byte has reached the file
      await new Promise<void>((done) => log.end(done));
      const result = await readResult(call.logPath);
      if (!result || result.is_error || result.structured_output === undefined) {
        reject(new Error(`${call.name} ended without a structured answer (exit ${code}); see ${call.logPath}`));
        return;
      }
      resolve({
        sessionId: result.session_id ?? null,
        output: result.structured_output as T,
        costUsd: result.total_cost_usd ?? 0,
      });
    });
  });
}
