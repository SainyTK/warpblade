import { freshMemory } from "../../bots/freshMemory";
import { createKeyDriver } from "../../bots/keyDriver";
import { BOT_TICK_MS } from "../../constants/bot";
import type { Policy } from "../../types/bot";
import type { Session } from "../../types/session";
import { readDefense } from "../defense";
import { answerScreens } from "./answerScreens";
import { KEEP_ALIVE_SHARE } from "./constants";
import { installRecorder } from "./installRecorder";
import { keepAlive } from "./keepAlive";
import { readRecording } from "./readRecording";
import type { StageEnding, StageOutcome } from "./types";

export async function playStage(session: Session, policy: Policy, limitMs: number): Promise<StageOutcome> {
  await installRecorder(session);
  const driver = createKeyDriver(session);
  const memory = freshMemory();
  const picks: string[] = [];
  const start = session.elapsedMs();
  let ending: StageEnding = "timeout";
  let level = 1;
  let falls = 0;
  let wasDead = false;
  let crystalShare = 1;
  for (;;) {
    const now = session.elapsedMs() - start;
    const [state, view] = await Promise.all([session.state(), readDefense(session)]);
    level = Math.max(level, state.level);
    if (view.stage !== null) {
      crystalShare = view.crystalShare;
    }
    if (view.dead && !wasDead) {
      falls++;
    }
    wasDead = view.dead;
    if (view.end || state.menu.context === "title") {
      ending = view.end === "held" || state.lastRun.outcome === "clear" ? "clear" : "fallen";
      break;
    }
    if (now > limitMs) {
      break;
    }
    if (!view.dead && view.heroHp < view.heroMaxHp * KEEP_ALIVE_SHARE) {
      await keepAlive(session);
    }
    if (await answerScreens(session, state, driver, policy, picks)) {
      continue;
    }
    memory.now = now;
    await driver.apply(policy.decide(state, memory));
    await session.advance(BOT_TICK_MS);
  }
  await driver.releaseAll();
  const recording = await readRecording(session);
  return {
    ending,
    seconds: Math.round((session.elapsedMs() - start) / 100) / 10,
    level,
    falls,
    crystalShare,
    rewards: recording.rewards,
    picks,
  };
}
