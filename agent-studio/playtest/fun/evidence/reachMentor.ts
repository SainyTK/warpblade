import { KEYS } from "../../constants/keys";
import type { Session } from "../../types/session";
import {
  MENTOR_APPROACH,
  MENTOR_DRIFT_MS,
  MENTOR_HOP_MS,
  MENTOR_REACH_X,
  MENTOR_REACH_Y,
  MENTOR_TRIES,
  WAIT,
} from "./constants";
import { readTrail } from "./readTrail";
import { walkTo } from "./walkTo";

export async function reachMentor(session: Session): Promise<boolean> {
  for (let tries = 0; tries < MENTOR_TRIES; tries++) {
    const { mentor, heroX, heroY } = await readTrail(session);
    if (!mentor) {
      return false;
    }
    if (Math.abs(heroY - mentor.y) <= MENTOR_REACH_Y && Math.abs(heroX - mentor.x) < MENTOR_REACH_X) {
      await session.advance(WAIT.mentor);
      return true;
    }
    if (Math.abs(heroY - mentor.y) > MENTOR_REACH_Y) {
      const side = tries % 2 === 0 ? 1 : -1;
      await walkTo(session, mentor.x - side * MENTOR_APPROACH);
      const toward = side > 0 ? KEYS.right : KEYS.left;
      await session.hold([KEYS.up, toward], MENTOR_HOP_MS);
      await session.hold([toward], MENTOR_DRIFT_MS);
      await session.advance(WAIT.shortScreen);
    } else {
      await walkTo(session, mentor.x);
    }
  }
  return false;
}
