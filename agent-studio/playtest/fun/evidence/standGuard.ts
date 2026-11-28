import { skilledPolicy } from "../../bots/skilled";
import type { Session } from "../../types/session";
import { readDefense } from "../defense";
import { BOT_TICK_MS } from "./constants";
import type { PlayEnd, PlayOptions, PlayResult } from "./types";
import { walkTo } from "./walkTo";

export async function standGuard(session: Session, options: PlayOptions): Promise<PlayResult> {
  await walkTo(session, (await readDefense(session)).crystalX);
  const start = session.elapsedMs();
  for (;;) {
    const [state, view] = await Promise.all([session.state(), readDefense(session)]);
    const finish = (end: PlayEnd): PlayResult => ({ end, state, view });
    if (options.until(state, view)) {
      return finish("reached");
    }
    if (state.menu.context === "title") {
      return finish("ended");
    }
    if (session.elapsedMs() - start > options.limitMs) {
      return finish("timeout");
    }
    if (state.pick.length > 0) {
      await session.choosePick(skilledPolicy.choosePick(state.pick));
      continue;
    }
    await session.advance(BOT_TICK_MS);
  }
}
