import { freshMemory } from "../../bots/freshMemory";
import { createKeyDriver } from "../../bots/keyDriver";
import { BOT_TICK_MS } from "../../constants/bot";
import type { Policy } from "../../types/bot";
import type { Session } from "../../types/session";
import { answerScreens } from "./answerScreens";
import { ROOM_LIMIT_MS } from "./constants";
import { installRecorder } from "./installRecorder";
import { readRecording } from "./readRecording";
import { readTrailInfo } from "./readTrailInfo";
import type { Ending, RoomOutcome } from "./types";

const seconds = (ms: number): number => Math.round(ms / 100) / 10;

export async function playRoom(session: Session, policy: Policy): Promise<RoomOutcome> {
  await installRecorder(session);
  const driver = createKeyDriver(session);
  const memory = freshMemory();
  const picks: string[] = [];
  const start = session.elapsedMs();
  let fightStart: number | null = null;
  let bossMax: number | null = null;
  let bossHp: number | null = null;
  let ending: Ending = "timeout";
  for (;;) {
    const now = session.elapsedMs() - start;
    const [state, info] = await Promise.all([session.state(), readTrailInfo(session)]);
    if (state.menu.context === "title" || info.dead) {
      ending = "fallen";
      break;
    }
    if (fightStart !== null && (info.bossHp === null || info.bossHp <= 0)) {
      ending = "clear";
      break;
    }
    if (info.bossHp !== null) {
      fightStart ??= now;
      bossMax = info.bossMax;
      bossHp = info.bossHp;
    }
    if (now > ROOM_LIMIT_MS) {
      break;
    }
    if (await answerScreens(session, state, driver, policy, picks)) {
      continue;
    }
    memory.now = now;
    await driver.apply(policy.decide(state, memory));
    await session.advance(BOT_TICK_MS);
  }
  await driver.releaseAll();
  const end = session.elapsedMs() - start;
  const recording = await readRecording(session);
  const removed = bossMax && bossHp !== null ? 1 - Math.max(0, bossHp) / bossMax : 0;
  return {
    ending,
    roomSeconds: seconds(end),
    fightSeconds: fightStart === null ? null : seconds(end - fightStart),
    bossMax,
    bossHpRemoved: ending === "clear" ? 1 : removed,
    hpLost: recording.hits.reduce((sum, hit) => sum + hit.loss, 0),
    hits: recording.hits,
    picks,
  };
}
