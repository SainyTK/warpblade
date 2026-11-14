import { type ChildProcess, spawn } from "node:child_process";
import { pathToFileURL } from "node:url";
import { VITE_LAUNCHER } from "../constants/viteLauncher";
import { onCleanup, onExitKill } from "./cleanup";
import { ensureDependencies } from "./dependencies";
import { freePort } from "./freePort";

const HOST = "127.0.0.1";
const START_TIMEOUT_MS = 30_000;
const POLL_MS = 200;
const STOP_GRACE_MS = 3_000;
/** tries at starting the server, each on a fresh port */
const START_ATTEMPTS = 3;
/** keep this much of the server's output to explain a failure */
const OUTPUT_KEEP = 4_000;

export interface DevServer {
  url: string;
  stop(): Promise<void>;
}

/** signal the server and everything it started */
function signal(child: ChildProcess, name: NodeJS.Signals): void {
  if (child.pid === undefined || child.exitCode !== null) {
    return;
  }
  try {
    process.kill(-child.pid, name);
  } catch {
    child.kill(name);
  }
}

function exited(child: ChildProcess, ms: number): Promise<boolean> {
  if (child.exitCode !== null || child.signalCode !== null) {
    return Promise.resolve(true);
  }
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(false), ms);
    child.once("exit", () => {
      clearTimeout(timer);
      resolve(true);
    });
  });
}

async function serving(url: string): Promise<boolean> {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch {
    return false;
  }
}

async function waitUntilServing(url: string, child: ChildProcess, output: () => string): Promise<void> {
  const deadline = Date.now() + START_TIMEOUT_MS;
  while (Date.now() < deadline) {
    if (child.exitCode !== null) {
      throw new Error(`Vite exited before serving:\n${output()}`);
    }
    if (await serving(url)) {
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }
  throw new Error(`Vite did not serve ${url} within ${START_TIMEOUT_MS / 1000} s:\n${output()}`);
}

/** one try at starting Vite on a port that was free a moment ago */
async function startOnFreePort(vite: string, root: string): Promise<DevServer> {
  const port = await freePort(HOST);
  const args = ["--input-type=module", "-e", VITE_LAUNCHER, pathToFileURL(vite).href, root, String(port), HOST];
  const child = spawn(process.execPath, args, {
    cwd: root,
    detached: true,
    stdio: ["ignore", "pipe", "pipe"],
    env: { ...process.env, BROWSER: "none" },
  });
  let log = "";
  const keep = (chunk: Buffer): void => {
    log = (log + chunk.toString()).slice(-OUTPUT_KEEP);
  };
  child.stdout?.on("data", keep);
  child.stderr?.on("data", keep);
  const forgetExitKill = onExitKill(() => signal(child, "SIGKILL"));
  const stop = async (): Promise<void> => {
    forgetCleanup();
    forgetExitKill();
    signal(child, "SIGTERM");
    if (!(await exited(child, STOP_GRACE_MS))) {
      signal(child, "SIGKILL");
    }
  };
  const forgetCleanup = onCleanup(stop);
  const url = `http://${HOST}:${port}`;
  try {
    await waitUntilServing(url, child, () => log);
  } catch (error) {
    await stop();
    throw error;
  }
  return { url, stop };
}

/**
 * The game's own Vite dev server on a free port, without hot reload, stopped when the command ends. The port is free
 * when it is picked and Vite is told to use that port or fail, so two commands running at once (in one worktree or in
 * several) never share a server; when another process takes the port in between, the start is tried again on a new one.
 */
export async function startDevServer(root: string): Promise<DevServer> {
  const vite = ensureDependencies(root);
  let failure: unknown;
  for (let attempt = 0; attempt < START_ATTEMPTS; attempt++) {
    try {
      return await startOnFreePort(vite, root);
    } catch (error) {
      failure = error;
    }
  }
  throw failure;
}
