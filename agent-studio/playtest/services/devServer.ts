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

/** the game's own Vite dev server on a free port, without hot reload, stopped when the command ends */
export async function startDevServer(root: string): Promise<DevServer> {
  const vite = ensureDependencies(root);
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
