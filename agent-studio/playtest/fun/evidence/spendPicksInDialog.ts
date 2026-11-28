import { skilledPolicy } from "../../bots/skilled";
import type { Session } from "../../types/session";
import { PICK_LIMIT } from "./constants";

export async function spendPicksInDialog(session: Session): Promise<number> {
  let taken = 0;
  for (; taken < PICK_LIMIT; taken++) {
    const { pick } = await session.state();
    if (pick.length === 0) {
      break;
    }
    await session.choosePick(skilledPolicy.choosePick(pick));
  }
  return taken;
}
