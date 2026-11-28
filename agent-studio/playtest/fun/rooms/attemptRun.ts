import type { Harness } from "../../session/harness";
import type { Session, SessionOptions } from "../../types/session";
import { secondsSince } from "../../utils/elapsed";
import { withWallLimit } from "../../utils/wallLimit";
import { RUN_ATTEMPTS } from "./constants";
import type { FailedRun, RunMeta } from "./types";

export interface RunAttempt<T> {
  id: string;
  hero: string;
  session: SessionOptions;
  wallMinutes: number;
  play(session: Session): Promise<T>;
}

export async function attemptRun<T>(harness: Harness, run: RunAttempt<T>): Promise<(T & RunMeta) | FailedRun> {
  const failures: string[] = [];
  while (failures.length < RUN_ATTEMPTS) {
    const started = performance.now();
    try {
      const session = await harness.newSession(run.session);
      try {
        const record = await withWallLimit(run.play(session), run.wallMinutes, run.id);
        const meta: RunMeta = {
          id: run.id,
          hero: run.hero,
          attempts: failures.length + 1,
          failures: [...failures],
          wallSeconds: secondsSince(started),
          pageErrors: session.errors(),
        };
        return { ...record, ...meta };
      } finally {
        await session.close().catch(() => undefined);
      }
    } catch (failure) {
      failures.push(String((failure as Error).stack ?? failure));
    }
  }
  return { kind: "failed", id: run.id, hero: run.hero, attempts: RUN_ATTEMPTS, failures };
}
