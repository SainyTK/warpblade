import { freshMemory } from "../../bots/freshMemory";
import { createKeyDriver } from "../../bots/keyDriver";
import { skilledPolicy } from "../../bots/skilled";
import { KEYS } from "../../constants/keys";
import type { Intent } from "../../types/bot";
import type { Session } from "../../types/session";
import { BOT_TICK_MS, CHEST_WAIT_MS, MOVE_EPSILON, NEAR_FOE, STUCK_HOP_MS, STUCK_MS, STUCK_WALK_MS } from "./constants";
import { readTrail } from "./readTrail";
import type { PlayEnd, PlayOptions, PlayResult } from "./types";

const WALK_ON: Intent = { hold: [KEYS.right], tap: [] };

export async function playOn(session: Session, options: PlayOptions): Promise<PlayResult> {
  const driver = createKeyDriver(session);
  const memory = freshMemory();
  const start = session.elapsedMs();
  let lastX = Number.NaN;
  let stillSince = 0;
  for (;;) {
    const state = await session.state();
    const trail = await readTrail(session);
    const finish = async (end: PlayEnd): Promise<PlayResult> => {
      await driver.releaseAll();
      return { end, state, trail };
    };
    if (options.until(state, trail)) {
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
    const blocked = trail.gate !== null || trail.hold !== null;
    if (Math.abs(state.hero.x - lastX) > MOVE_EPSILON || blocked) {
      stillSince = memory.now;
    }
    lastX = state.hero.x;
    const nearFoe = state.enemies.some(
      (foe) => foe.hp > 0 && Math.abs(foe.x - state.hero.x) < NEAR_FOE && Math.abs(foe.y - state.hero.y) < NEAR_FOE,
    );
    if (!nearFoe && !blocked && memory.now - stillSince > STUCK_MS) {
      await driver.releaseAll();
      await session.hold([KEYS.right, KEYS.up], STUCK_HOP_MS);
      await session.hold([KEYS.right], STUCK_WALK_MS);
      stillSince = memory.now;
      continue;
    }
    if (intent.hold.length === 0 && intent.tap.length === 0 && !blocked) {
      intent = WALK_ON;
    }
    await driver.apply(intent);
    await session.advance(BOT_TICK_MS);
  }
}
