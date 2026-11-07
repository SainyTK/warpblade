import { BOT_TICK_MS, CHEST_WAIT_MS } from "../constants/bot";
import { KEYS } from "../constants/keys";
import type { BotMemory, Policy } from "../types/bot";
import type { Session } from "../types/session";
import type { GameSnapshot } from "../types/snapshot";
import { createKeyDriver } from "./keyDriver";

export type AutopilotEnd = "fallen" | "clear" | "timeout" | "reached";
export interface AutopilotResult {
  end: AutopilotEnd;
  state: GameSnapshot;
  picks: string[];
}
export interface AutopilotOptions {
  /** stop once this holds */
  until?: (state: GameSnapshot) => boolean;
  /** game milliseconds before giving up */
  limitMs: number;
  /** sees every state read during play */
  onTick?: (state: GameSnapshot) => void;
}

const freshMemory = (): BotMemory => ({ now: 0, lastDodge: -1e9, lastVault: -1e9, ultUntil: 0 });

/** play the current run with a policy, a decision every tick of game time, until it ends or the goal is met */
export async function autopilot(session: Session, policy: Policy, options: AutopilotOptions): Promise<AutopilotResult> {
  const driver = createKeyDriver(session);
  const memory = freshMemory();
  const start = session.elapsedMs();
  const picks: string[] = [];
  const finish = async (end: AutopilotEnd, state: GameSnapshot): Promise<AutopilotResult> => {
    await driver.releaseAll();
    return { end, state, picks };
  };
  for (;;) {
    const state = await session.state();
    if (state.menu.context === "title") {
      return finish(state.lastRun.outcome === "clear" ? "clear" : "fallen", state);
    }
    options.onTick?.(state);
    if (options.until?.(state)) {
      return finish("reached", state);
    }
    if (session.elapsedMs() - start > options.limitMs) {
      return finish("timeout", state);
    }
    if (state.menu.context === "pause") {
      await driver.releaseAll();
      await session.tap(KEYS.pause);
      continue;
    }
    if (state.mode === "chest") {
      await driver.releaseAll();
      await session.advance(CHEST_WAIT_MS);
      await session.tap(KEYS.attack);
      continue;
    }
    if (state.pick.length > 0) {
      await driver.releaseAll();
      const index = policy.choosePick(state.pick);
      picks.push(state.pick[index]?.name ?? "");
      await session.choosePick(index);
      continue;
    }
    memory.now = session.elapsedMs() - start;
    await driver.apply(policy.decide(state, memory));
    await session.advance(BOT_TICK_MS);
  }
}
