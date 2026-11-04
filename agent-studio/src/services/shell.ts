import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";

export interface ShellResult {
  code: number;
  stdout: string;
  stderr: string;
}

interface ShellOptions {
  cwd: string;
  /** append both streams to this file as well */
  logPath?: string;
  timeoutMs?: number;
  env?: NodeJS.ProcessEnv;
}

/** run a program with arguments (no shell), and resolve with its exit code and output */
export function exec(command: string, args: string[], options: ShellOptions): Promise<ShellResult> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: options.cwd,
      env: options.env ?? process.env,
      stdio: ["ignore", "pipe", "pipe"],
      detached: true,
    });
    const log = options.logPath ? createWriteStream(options.logPath, { flags: "a" }) : null;
    log?.write(`\n$ ${command} ${args.join(" ")}\n`);
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk: Buffer) => {
      stdout += chunk.toString();
      log?.write(chunk);
    });
    child.stderr.on("data", (chunk: Buffer) => {
      stderr += chunk.toString();
      log?.write(chunk);
    });
    const timer = options.timeoutMs
      ? setTimeout(() => {
          stderr += `\nTimed out after ${options.timeoutMs} ms`;
          if (child.pid) process.kill(-child.pid, "SIGTERM");
        }, options.timeoutMs)
      : null;
    child.on("error", reject);
    child.on("close", (code) => {
      if (timer) clearTimeout(timer);
      log?.end();
      resolve({ code: code ?? 1, stdout, stderr });
    });
  });
}

/** run a program and return its trimmed stdout, or throw with its stderr */
export async function run(command: string, args: string[], options: ShellOptions): Promise<string> {
  const result = await exec(command, args, options);
  if (result.code !== 0) {
    throw new Error(
      `${command} ${args.join(" ")} failed (${result.code}): ${result.stderr.trim() || result.stdout.trim()}`,
    );
  }
  return result.stdout.trim();
}
