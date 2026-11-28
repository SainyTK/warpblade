import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { onExitKill } from "./cleanup";

const run = promisify(execFile);
const WINDOW_MS = 250;
const MAX_PAUSE_MS = 1000;
const TARGET_SHARE_OF_BUDGET = 0.85;
const PEAK_SPAN_SECONDS = 5;

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

interface TreeCpu {
  pids: number[];
  byPid: Map<number, number>;
}

const EMPTY_TREE: TreeCpu = { pids: [], byPid: new Map() };

function spentSince(previous: TreeCpu, now: TreeCpu): number {
  let spent = 0;
  for (const [pid, seconds] of now.byPid) spent += Math.max(0, seconds - (previous.byPid.get(pid) ?? 0));
  return spent;
}

async function treeCpu(rootPid: number): Promise<TreeCpu> {
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
  return { pids: members.map((row) => row.pid), byPid: new Map(members.map((row) => [row.pid, row.seconds])) };
}

function signalAll(pids: number[], signal: NodeJS.Signals): void {
  for (const pid of pids) {
    try {
      process.kill(pid, signal);
    } catch {}
  }
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function endTree(rootPid: number): Promise<void> {
  const { pids } = await treeCpu(rootPid).catch(() => ({ pids: [rootPid], byPid: new Map<number, number>() }));
  signalAll(pids, "SIGCONT");
  signalAll(pids, "SIGTERM");
}

export function governCpu(rootPid: number, budgetCores: number): { stop: () => Promise<CpuStats> } {
  let running = true;
  let peak = 0;
  let paused = 0;
  const started = performance.now();
  let used = 0;
  const target = budgetCores * TARGET_SHARE_OF_BUDGET;
  const recent: { seconds: number; spent: number }[] = [];
  const track = (seconds: number, spent: number) => {
    recent.push({ seconds, spent });
    while (recent.reduce((sum, entry) => sum + entry.seconds, 0) - recent[0].seconds >= PEAK_SPAN_SECONDS)
      recent.shift();
    const span = recent.reduce((sum, entry) => sum + entry.seconds, 0);
    if (span >= PEAK_SPAN_SECONDS) peak = Math.max(peak, recent.reduce((sum, entry) => sum + entry.spent, 0) / span);
  };
  const loop = (async () => {
    let previous = await treeCpu(rootPid).catch(() => EMPTY_TREE);
    let previousAt = performance.now();
    let ownPrevious = process.cpuUsage();
    let balance = 0;
    while (running) {
      await sleep(WINDOW_MS);
      const now = await treeCpu(rootPid).catch(() => previous);
      const own = process.cpuUsage(ownPrevious);
      ownPrevious = process.cpuUsage();
      const at = performance.now();
      const seconds = (at - previousAt) / 1000;
      const spent = spentSince(previous, now) + (own.user + own.system) / 1e6;
      used += spent;
      track(seconds, spent);
      balance = Math.min(0, balance + target * seconds - spent);
      previous = now;
      previousAt = at;
      if (balance < 0 && running) {
        const pause = Math.min(MAX_PAUSE_MS, (-balance / target) * 1000);
        const resume = onExitKill(() => signalAll(now.pids, "SIGCONT"));
        signalAll(now.pids, "SIGSTOP");
        await sleep(pause);
        signalAll(now.pids, "SIGCONT");
        resume();
        paused += pause;
        track(pause / 1000, 0);
        previousAt = performance.now();
        balance = Math.min(0, balance + target * (pause / 1000));
      }
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
