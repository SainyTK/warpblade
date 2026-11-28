import type { Session } from "../../types/session";
import type { PickCard } from "../../types/snapshot";
import { INTERACT_KEY, WAIT } from "./constants";
import { reachMentor } from "./reachMentor";

export interface MentorVisit {
  atMentor: () => Promise<void>;
  atPick: (cards: readonly PickCard[]) => Promise<void>;
}

export async function visitMentor(session: Session, visit: MentorVisit): Promise<string | null> {
  if (!(await reachMentor(session))) {
    return "the mentor was not reached";
  }
  await visit.atMentor();
  await session.tap(INTERACT_KEY);
  await session.advance(WAIT.pick);
  const { pick } = await session.state();
  if (pick.length === 0) {
    return "talking to the mentor opened no pick";
  }
  await visit.atPick(pick);
  return null;
}
