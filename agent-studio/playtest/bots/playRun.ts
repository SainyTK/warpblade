import type { Policy } from "../types/bot";
import type { BotRun } from "../types/report";
import type { Session } from "../types/session";
import { secondsSince } from "../utils/elapsed";
import { autopilot } from "./autopilot";
import { createRunTracker } from "./runTracker";

/** one whole run from the start menu with a policy, measured */
export async function playRun(session: Session, heroId: string, policy: Policy, maxMinutes: number): Promise<BotRun> {
  const wallStart = performance.now();
  await session.startRun(heroId);
  const gameStart = session.elapsedMs();
  const tracker = createRunTracker();
  const result = await autopilot(session, policy, { limitMs: maxMinutes * 60_000, onTick: tracker.observe });
  const ended = result.end === "fallen" || result.end === "clear";
  return {
    hero: heroId,
    policy: policy.name,
    wave: ended ? Math.max(tracker.wave(), result.state.lastRun.wave) : tracker.wave(),
    level: tracker.level(),
    kills: tracker.kills(),
    coins: ended ? result.state.lastRun.coins : tracker.coins(),
    seconds: Math.round((session.elapsedMs() - gameStart) / 100) / 10,
    wallSeconds: secondsSince(wallStart),
    ending: result.end === "reached" ? "timeout" : result.end,
    hpLostByWave: tracker.hpLostByWave(),
    picks: result.picks,
  };
}
