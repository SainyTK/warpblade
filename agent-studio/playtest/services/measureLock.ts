import { mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const LOCK_DIR = join(tmpdir(), "warpblade-fun-measure.lock");
const POLL_MS = 5000;
const STARTING_GRACE_MS = 60000;

function alive(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function holder(): Promise<number | null> {
  const text = await readFile(join(LOCK_DIR, "pid"), "utf8").catch(() => "");
  const pid = Number(text);
  return pid > 0 ? pid : null;
}

export async function acquireMeasureLock(): Promise<() => Promise<void>> {
  for (;;) {
    try {
      await mkdir(LOCK_DIR);
      await writeFile(join(LOCK_DIR, "pid"), String(process.pid));
      return () => rm(LOCK_DIR, { recursive: true, force: true });
    } catch {
      const pid = await holder();
      const age =
        Date.now() -
        (await stat(LOCK_DIR)
          .then((info) => info.mtimeMs)
          .catch(() => 0));
      if ((pid === null && age > STARTING_GRACE_MS) || (pid !== null && !alive(pid))) {
        await rm(LOCK_DIR, { recursive: true, force: true });
        continue;
      }
      await new Promise((resolve) => setTimeout(resolve, POLL_MS));
    }
  }
}
