import { KEYS } from "../../constants/keys";
import type { Session } from "../../types/session";
import { MENU_STEPS, WAIT } from "./constants";

export async function openMenuEntry(session: Session, opens: string): Promise<boolean> {
  for (let step = 0; step < MENU_STEPS; step++) {
    const { menu } = await session.state();
    if (menu.focus?.opens === opens) {
      await session.tap(KEYS.select);
      await session.advance(WAIT.menu);
      return true;
    }
    await session.tap(KEYS.down);
  }
  return false;
}

export async function backToMainMenu(session: Session): Promise<void> {
  for (let step = 0; step < MENU_STEPS && (await session.state()).menu.screen !== "main"; step++) {
    await session.tap(KEYS.back);
  }
  await session.advance(WAIT.shortScreen);
}

export async function chooseFocused(session: Session, waitMs: number): Promise<void> {
  await session.tap(KEYS.select);
  await session.advance(waitMs);
}
