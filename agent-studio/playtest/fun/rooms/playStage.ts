import { freshMemory } from "../../bots/freshMemory";
import { createKeyDriver } from "../../bots/keyDriver";
import { BOT_TICK_MS } from "../../constants/bot";
import type { Policy } from "../../types/bot";
import type { Session } from "../../types/session";
import { answerScreens } from "./answerScreens";
import { KEEP_ALIVE_SHARE, STAGE_DONE_MODE } from "./constants";
import { installRecorder } from "./installRecorder";
import { keepAlive } from "./keepAlive";
import { readRecording } from "./readRecording";
import { readTrailInfo } from "./readTrailInfo";
import { readWalls } from "./readWalls";
import { freshRoadWalker, roadStep } from "./roadWalker";
import type { Ending, StageOutcome } from "./types";

export async function playStage(session: Session, policy: Policy, limitMs: number): Promise<StageOutcome> {
  await installRecorder(session);
  const walls = await readWalls(session);
  const driver = createKeyDriver(session);
  const memory = freshMemory();
  const picks: string[] = [];
  const start = session.elapsedMs();
  const walker = freshRoadWalker((await readTrailInfo(session)).heroX);
  let ending: Ending = "timeout";
  let level = 1;
  for (;;) {
    const now = session.elapsedMs() - start;
    const [state, info] = await Promise.all([session.state(), readTrailInfo(session)]);
    level = Math.max(level, state.level);
    if (info.won || info.mode === STAGE_DONE_MODE) {
      ending = "clear";
      break;
    }
    if (state.menu.context === "title" || info.dead) {
      ending = "fallen";
      break;
    }
    if (now > limitMs) {
      break;
    }
    if (info.heroHp < info.heroMaxHp * KEEP_ALIVE_SHARE) {
      await keepAlive(session);
    }
    if (await answerScreens(session, state, driver, policy, picks)) {
      continue;
    }
    memory.now = now;
    const step = roadStep(walker, state, info, walls, now);
    await driver.apply(step.kind === "fight" ? policy.decide(state, memory) : step.intent);
    await session.advance(BOT_TICK_MS);
  }
  await driver.releaseAll();
  const recording = await readRecording(session);
  return {
    ending,
    seconds: Math.round((session.elapsedMs() - start) / 100) / 10,
    level,
    rewards: recording.rewards,
    picks,
  };
}
