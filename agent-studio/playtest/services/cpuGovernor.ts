import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);
const WINDOW_MS = 500;
const MAX_PAUSE_MS = 4000;

export interface CpuStats {
  budgetCores: number;
  averageCores: number;
  peakCores: number;
  pausedSeconds: number;
}

function cpuSeconds(time: string): number {
  const [days, clock] = time.includes("-") ? time.split("-") : ["0", time];
  const parts = clock.split(":").map(Number);
  const seconds = parts.reduce((total, part) => total * 60 + part, 0);
  return Number(days) * 86400 + seconds;
}

async function treeCpu(rootPid: number): Promise<{ pids: number[]; seconds: number }> {
  const { stdout } = await run("ps", ["-A", "-o", "pid=,ppid=,time="]);
  const rows = stdout
    .trim()
    .split("\n")
    .map((line) => line.trim().split(/\s+/))
    .map(([pid, ppid, time]) => ({ pid: Number(pid), ppid: Number(ppid), seconds: cpuSeconds(time) }));
  const tree = new Set([rootPid]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const row of rows) {
      if (!tree.has(row.pid) && tree.has(row.ppid)) {
        tree.add(row.pid);
        grew = true;
      }
    }
  }
  const members = rows.filter((row) => tree.has(row.pid));
  return { pids: members.map((row) => row.pid), seconds: members.reduce((sum, row) => sum + row.seconds, 0) };
}

function signalAll(pids: number[], signal: NodeJS.Signals): void {
  for (const pid of pids) {
    try {
      process.kill(pid, signal);
    } catch {}
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export function governCpu(rootPid: number, budgetCores: number): { stop: () => Promise<CpuStats> } {
  let running = true;
  let peak = 0;
  let paused = 0;
  const started = performance.now();
  let used = 0;
  const loop = (async () => {
    let previous = await treeCpu(rootPid).catch(() => ({ pids: [], seconds: 0 }));
    let previousAt = performance.now();
    while (running) {
      await sleep(WINDOW_MS);
      const now = await treeCpu(rootPid).catch(() => previous);
      const at = performance.now();
      const spent = Math.max(0, now.seconds - previous.seconds);
      const cores = spent / ((at - previousAt) / 1000);
      peak = Math.max(peak, cores);
      used += spent;
      if (cores > budgetCores && running) {
        const pause = Math.min(MAX_PAUSE_MS, WINDOW_MS * (cores / budgetCores - 1));
        signalAll(now.pids, "SIGSTOP");
        await sleep(pause);
        signalAll(now.pids, "SIGCONT");
        paused += pause;
      }
      previous = now;
      previousAt = performance.now();
    }
  })();
  return {
    stop: async () => {
      running = false;
      await loop;
      const wall = (performance.now() - started) / 1000;
      return {
        budgetCores,
        averageCores: Math.round((used / Math.max(wall, 1)) * 100) / 100,
        peakCores: Math.round(peak * 100) / 100,
        pausedSeconds: Math.round(paused / 100) / 10,
      };
    },
  };
}
