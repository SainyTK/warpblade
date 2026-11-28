import type { Session } from "../../types/session";
import { FACE_TAP_MS, HOME_TOLERANCE, RESET_STEP_MS, RESET_TRIES, RESET_WAIT_MS, REST_MS } from "./constants";
import { fighterAtRest } from "./fighterBusy";
import { readFighter } from "./readFighter";

const LEFT = "KeyA";
const RIGHT = "KeyD";

export async function resetPosition(session: Session, homeX: number): Promise<void> {
  for (let i = 0; i < RESET_TRIES; i++) {
    const probe = await readFighter(session);
    if (fighterAtRest(probe, homeX, HOME_TOLERANCE)) {
      break;
    }
    if (probe.ground && Math.abs(probe.x - homeX) >= HOME_TOLERANCE) {
      await session.press(probe.x > homeX ? LEFT : RIGHT, RESET_STEP_MS);
    } else {
      await session.advance(RESET_WAIT_MS);
    }
  }
  const probe = await readFighter(session);
  if (probe.face !== 1) {
    await session.press(RIGHT, FACE_TAP_MS);
  }
  await session.advance(REST_MS);
}
