import type { Policy } from "../../../types/bot";
import type { Session } from "../../../types/session";
import { SETUP_PICK_LIMIT } from "../constants";
import { dealPick } from "./dealPick";
import { takeDealt } from "./takeDealt";

export async function spendPicks(session: Session, policy: Policy): Promise<string[]> {
  const picks: string[] = [];
  for (let step = 0; step < SETUP_PICK_LIMIT; step++) {
    const cards = await dealPick(session);
    if (cards.length === 0) {
      return picks;
    }
    const index = policy.choosePick(cards);
    picks.push(cards[index]?.name ?? "");
    await takeDealt(session, index);
  }
  throw new Error(`Setup picks did not end after ${SETUP_PICK_LIMIT} steps.`);
}
