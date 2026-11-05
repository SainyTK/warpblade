import { KEYS } from "../constants/keys";
import type { Session } from "../types/session";
import type { MenuSnapshot } from "../types/snapshot";

/** more entries than any menu screen has */
const MAX_STEPS = 16;
const START_TIMEOUT_MS = 3_000;

type Focus = NonNullable<MenuSnapshot["focus"]>;

/** move the menu focus with this key until the focused entry matches, reading the focus after each press */
async function focusEntry(session: Session, matches: (focus: Focus) => boolean, key: string): Promise<void> {
  for (let step = 0; step < MAX_STEPS; step++) {
    const { menu } = await session.state();
    if (menu.focus && matches(menu.focus)) {
      return;
    }
    await session.tap(key);
  }
  const { menu } = await session.state();
  throw new Error(`No matching menu entry on the ${menu.context} ${menu.screen} screen (focus: ${menu.focus?.text}).`);
}

/** mid-run: pause, then Quit run, which asks to be pressed twice */
async function quitRun(session: Session): Promise<void> {
  await session.tap(KEYS.pause);
  await focusEntry(session, (focus) => focus.text.startsWith("Quit"), KEYS.down);
  await session.tap(KEYS.select);
  await session.tap(KEYS.select);
}

/** from wherever the game is, through the start menu and the hero screen, into a fresh run */
export async function startRunThroughMenu(session: Session, heroId: string): Promise<void> {
  const before = await session.state();
  if (before.mode === "pick") {
    throw new Error("Answer the open skill pick before starting a new run.");
  }
  if (before.menu.context !== "title") {
    await quitRun(session);
  }
  for (let step = 0; step < MAX_STEPS && (await session.state()).menu.screen !== "main"; step++) {
    await session.tap(KEYS.back);
  }
  await focusEntry(session, (focus) => focus.opens === "hero", KEYS.down);
  await session.tap(KEYS.select);
  await focusEntry(session, (focus) => focus.hero === heroId, KEYS.right);
  await session.tap(KEYS.select);
  await session.waitFor(
    // a run begun at a later wave opens its level-up picks at once
    (state) =>
      state.menu.context === null && (state.mode === "play" || state.mode === "pick") && state.hero.id === heroId,
    START_TIMEOUT_MS,
    `a run with ${heroId}`,
  );
}
