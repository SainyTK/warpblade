import type { Session } from "../../types/session";
import { LIMITS, WAIT } from "./constants";

export async function waitForResult(session: Session): Promise<boolean> {
  for (let poll = 0; poll < LIMITS.resultPolls; poll++) {
    const { menu } = await session.state();
    if (menu.context === "title") {
      await session.advance(WAIT.result);
      return (await session.state()).menu.screen === "result";
    }
    await session.advance(WAIT.resultPoll);
  }
  return false;
}
