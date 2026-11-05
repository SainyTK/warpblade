/** Everything started that must stop when a command ends, fails or is interrupted. */
type Cleanup = () => Promise<void> | void;

const cleanups = new Set<Cleanup>();
const exitKills = new Set<() => void>();
let installed = false;

async function interrupted(): Promise<void> {
  await runCleanups();
  process.exit(130);
}

function install(): void {
  if (installed) {
    return;
  }
  installed = true;
  for (const signal of ["SIGINT", "SIGTERM", "SIGHUP"] as const) {
    process.once(signal, () => void interrupted());
  }
  // the last resort: an exit that skipped the cleanups still kills what it started
  process.on("exit", () => {
    for (const kill of exitKills) {
      kill();
    }
  });
}

/** run this when the command ends; returns a function that forgets it */
export function onCleanup(cleanup: Cleanup): () => void {
  install();
  cleanups.add(cleanup);
  return () => cleanups.delete(cleanup);
}

/** a synchronous kill for process exit, when there is no time left for anything else */
export function onExitKill(kill: () => void): () => void {
  install();
  exitKills.add(kill);
  return () => exitKills.delete(kill);
}

/** stop everything still running, newest first */
export async function runCleanups(): Promise<void> {
  for (const cleanup of [...cleanups].reverse()) {
    cleanups.delete(cleanup);
    try {
      await cleanup();
    } catch (error) {
      console.error(`Cleanup failed: ${String(error)}`);
    }
  }
}
