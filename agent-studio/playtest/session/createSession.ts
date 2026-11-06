import type { Browser } from "playwright-core";
import { autopilot } from "../bots/autopilot";
import { skilledPolicy } from "../bots/skilled";
import { DEFAULT_VIEWPORT, FRAME_GRID_SHIM, NAME_SHIM } from "../constants/browser";
import { CLOCK_START_MS, FRAME_MS, PLAYTEST_STORAGE } from "../constants/game";
import { readHeroes } from "../services/pageHeroes";
import { readSnapshot } from "../services/pageSnapshot";
import type { Session, SessionOptions } from "../types/session";
import type { GameSnapshot } from "../types/snapshot";
import { choosePickThroughDialog } from "./choosePick";
import { startRunThroughMenu } from "./menuNav";
import { type GrabberSlot, record } from "./record";
import { still } from "./still";

/** how long a press lasts when no length is given */
const PRESS_MS = 80;
/** how often waitFor reads the state */
const WAIT_STEP_MS = 50;
/** game minutes jumpToWave may play */
const JUMP_LIMIT_MS = 30 * 60_000;
const LOAD_TIMEOUT_MS = 30_000;

/**
 * A fresh browser context with the game loaded and paused on the start menu.
 * Time in the page runs on Playwright's fake clock, moved only by advance(): the game steps the same way on every
 * machine and every run, and frames for a recording are taken at exact game times.
 */
export async function createSession(browser: Browser, url: string, options: SessionOptions = {}): Promise<Session> {
  const context = await browser.newContext({ viewport: options.viewport ?? DEFAULT_VIEWPORT, deviceScaleFactor: 1 });
  await context.addInitScript(NAME_SHIM);
  await context.addInitScript(({ key, value }) => localStorage.setItem(key, value), PLAYTEST_STORAGE);
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(`page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") {
      errors.push(`console error: ${message.text()}`);
    }
  });
  await page.clock.install({ time: CLOCK_START_MS });
  await page.clock.pauseAt(CLOCK_START_MS + 1000);
  // after the clock is installed, so it rounds the fake performance.now()
  await page.addInitScript(FRAME_GRID_SHIM);
  const start = options.start ? `?wave=${options.start.wave}&level=${options.start.level}` : "";
  await page.goto(`${url}${start}`, { waitUntil: "load", timeout: LOAD_TIMEOUT_MS });
  await page.evaluate(() => document.fonts.ready.then(() => undefined));
  const slot: GrabberSlot = { current: null };
  let elapsed = 0;

  const session: Session = {
    page,
    heroes: () => readHeroes(page),
    state: () => readSnapshot(page),
    async advance(ms) {
      let left = Math.max(0, Math.round(ms));
      while (left > 0) {
        const chunk = slot.current ? Math.min(left, slot.current.untilNext()) : left;
        await page.clock.runFor(chunk);
        elapsed += chunk;
        left -= chunk;
        await slot.current?.passed(chunk);
      }
    },
    elapsedMs: () => elapsed,
    keyDown: (key) => page.keyboard.down(key),
    keyUp: (key) => page.keyboard.up(key),
    async press(key, ms = PRESS_MS) {
      await session.hold([key], ms);
    },
    async hold(keys, ms) {
      for (const key of keys) {
        await page.keyboard.down(key);
      }
      await session.advance(ms);
      for (const key of keys) {
        await page.keyboard.up(key);
      }
    },
    async tap(key) {
      await page.keyboard.down(key);
      await session.advance(FRAME_MS);
      await page.keyboard.up(key);
      await session.advance(FRAME_MS);
    },
    async waitFor(predicate, timeoutMs, label = "the condition") {
      const end = elapsed + timeoutMs;
      for (;;) {
        const state = await session.state();
        if (predicate(state)) {
          return state;
        }
        if (elapsed >= end) {
          throw new Error(`Timed out after ${timeoutMs} ms of game time waiting for ${label}.`);
        }
        await session.advance(WAIT_STEP_MS);
      }
    },
    startRun: (heroId) => startRunThroughMenu(session, heroId),
    choosePick: (index) => choosePickThroughDialog(session, index),
    async jumpToWave(wave): Promise<GameSnapshot> {
      const result = await autopilot(session, skilledPolicy, {
        until: (state) => state.wave >= wave,
        limitMs: JUMP_LIMIT_MS,
      });
      if (result.end !== "reached") {
        throw new Error(`The run ended (${result.end}) at wave ${result.state.lastRun.wave} before wave ${wave}.`);
      }
      return result.state;
    },
    evaluate: page.evaluate.bind(page) as Session["evaluate"],
    still: (path) => still(page, path),
    record: (basePath, play, recordOptions) => record(page, slot, basePath, play, recordOptions),
    errors: () => [...errors],
    close: () => context.close(),
  };
  // move to the middle of the second frame: from here every session meets the game's frames at the same points
  const ticks = await page.evaluate(() => (globalThis as unknown as { __playtestRawNow(): number }).__playtestRawNow());
  await session.advance((Math.floor(ticks / FRAME_MS) + 1) * FRAME_MS + FRAME_MS / 2 - ticks);
  elapsed = 0;
  if (options.hero) {
    await session.startRun(options.hero);
  }
  return session;
}
