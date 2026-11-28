import { freshMemory } from "../../bots/freshMemory";
import { createKeyDriver } from "../../bots/keyDriver";
import { skilledPolicy } from "../../bots/skilled";
import { KEYS } from "../../constants/keys";
import type { Intent } from "../../types/bot";
import type { Session } from "../../types/session";
import { readDefense } from "../defense";
import { BOT_TICK_MS, CHEST_WAIT_MS, CRYSTAL_REACH } from "./constants";
import type { PlayEnd, PlayOptions, PlayResult } from "./types";

const toward = (from: number, to: number): Intent => ({ hold: [to < from ? KEYS.left : KEYS.right], tap: [] });

export async function playOn(session: Session, options: PlayOptions): Promise<PlayResult> {
  const driver = createKeyDriver(session);
  const memory = freshMemory();
  const start = session.elapsedMs();
  for (;;) {
    const [state, view] = await Promise.all([session.state(), readDefense(session)]);
    const finish = async (end: PlayEnd): Promise<PlayResult> => {
      await driver.releaseAll();
      return { end, state, view };
    };
    if (options.until(state, view)) {
      return finish("reached");
    }
    if (state.menu.context === "title") {
      return finish("ended");
    }
    if (session.elapsedMs() - start > options.limitMs) {
      return finish("timeout");
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
      await session.choosePick(skilledPolicy.choosePick(state.pick));
      continue;
    }
    if (state.mode !== "play") {
      await driver.releaseAll();
      await session.advance(BOT_TICK_MS);
      continue;
    }
    memory.now = session.elapsedMs() - start;
    let intent = skilledPolicy.decide(state, memory);
    const idle = intent.hold.length === 0 && intent.tap.length === 0;
    if (idle && view.stage !== null && Math.abs(state.hero.x - view.crystalX) > CRYSTAL_REACH) {
      intent = toward(state.hero.x, view.crystalX);
    }
    await driver.apply(intent);
    await session.advance(BOT_TICK_MS);
  }
}
