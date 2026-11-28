import type { KeyDriver } from "../../bots/keyDriver";
import { CHEST_WAIT_MS } from "../../constants/bot";
import { KEYS } from "../../constants/keys";
import type { Policy } from "../../types/bot";
import type { Session } from "../../types/session";
import type { GameSnapshot } from "../../types/snapshot";

export async function answerScreens(
  session: Session,
  state: GameSnapshot,
  driver: KeyDriver,
  policy: Policy,
  picks: string[],
): Promise<boolean> {
  if (state.menu.context === "pause") {
    await driver.releaseAll();
    await session.tap(KEYS.pause);
    return true;
  }
  if (state.mode === "chest") {
    await driver.releaseAll();
    await session.advance(CHEST_WAIT_MS);
    await session.tap(KEYS.attack);
    return true;
  }
  if (state.pick.length > 0) {
    await driver.releaseAll();
    const index = policy.choosePick(state.pick);
    picks.push(state.pick[index]?.name ?? "");
    await session.choosePick(index);
    return true;
  }
  return false;
}
