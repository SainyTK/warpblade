import { PICK_RETRIES, PICK_RETRY_MS } from "../constants/bot";
import { KEYS } from "../constants/keys";
import type { Session } from "../types/session";

const OPEN_TIMEOUT_MS = 2_000;

/** move the highlight to the card with D, reading which card is selected, then learn it with J */
export async function choosePickThroughDialog(session: Session, index: number): Promise<void> {
  let state = await session.waitFor((s) => s.pick.length > 0, OPEN_TIMEOUT_MS, "the skill pick to open");
  const target = Math.max(0, Math.min(index, state.pick.length - 1));
  for (let step = 0; step < state.pick.length && !state.pick[target].selected; step++) {
    await session.tap(KEYS.right);
    state = await session.state();
  }
  const waiting = state.picks;
  // the dialog ignores keys for a moment after it opens, so a press may need to wait and come again
  for (let attempt = 0; attempt < PICK_RETRIES; attempt++) {
    await session.tap(KEYS.select);
    const after = await session.state();
    if (after.mode !== "pick" || after.picks < waiting) {
      return;
    }
    await session.advance(PICK_RETRY_MS);
  }
  throw new Error("The skill pick did not take the card.");
}
