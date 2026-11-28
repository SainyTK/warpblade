import { freshMemory } from "../../bots/freshMemory";
import { createKeyDriver } from "../../bots/keyDriver";
import { BOT_TICK_MS } from "../../constants/bot";
import type { Policy } from "../../types/bot";
import type { Session } from "../../types/session";
import { type FightPlan, readDefense } from "../defense";
import { answerScreens } from "./answerScreens";
import { FIGHT_LIMIT_MS } from "./constants";
import { installRecorder } from "./installRecorder";
import { readRecording } from "./readRecording";
import type { FightEnding, FightOutcome } from "./types";

const seconds = (ms: number): number => Math.round(ms / 100) / 10;

export async function playFight(session: Session, plan: FightPlan, policy: Policy): Promise<FightOutcome> {
  await installRecorder(session);
  const driver = createKeyDriver(session);
  const memory = freshMemory();
  const picks: string[] = [];
  const start = session.elapsedMs();
  const crystalAtStart = (await readDefense(session)).crystalShare;
  let crystalShare = crystalAtStart;
  let fightStart: number | null = null;
  let arrivedAt: number | null = null;
  let bossMax: number | null = null;
  let bossHp: number | null = null;
  let falls = 0;
  let wasDead = false;
  let ending: FightEnding = "timeout";
  for (;;) {
    const now = session.elapsedMs() - start;
    const [state, view] = await Promise.all([session.state(), readDefense(session)]);
    crystalShare = view.crystalShare;
    if (view.dead && !wasDead) {
      falls++;
    }
    wasDead = view.dead;
    const foe = view.bigFoes.find((entry) => entry.kind === plan.kind);
    if (fightStart !== null && (!foe || foe.hp <= 0)) {
      ending = "clear";
      break;
    }
    if (view.end || state.menu.context === "title") {
      ending = view.end === "held" ? "held" : "shattered";
      break;
    }
    if (foe) {
      fightStart ??= now;
      arrivedAt ??= Math.round(view.elapsed);
      bossMax = foe.max;
      bossHp = foe.hp;
    }
    if (now - (fightStart ?? 0) > FIGHT_LIMIT_MS) {
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
  const hits = fightStart === null ? [] : recording.hits.filter((hit) => hit.t >= (fightStart ?? 0));
  const removed = bossMax && bossHp !== null ? 1 - Math.max(0, bossHp) / bossMax : 0;
  return {
    ending,
    arrivedAt,
    fightSeconds: fightStart === null ? null : seconds(end - fightStart),
    bossMax,
    bossHpRemoved: ending === "clear" ? 1 : removed,
    hpLost: hits.reduce((sum, hit) => sum + hit.loss, 0),
    falls,
    crystalLost: Math.max(0, crystalAtStart - crystalShare),
    hits,
    picks,
  };
}
