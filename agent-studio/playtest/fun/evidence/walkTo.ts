import { KEYS } from "../../constants/keys";
import type { Session } from "../../types/session";
import { WALK_STEP_MS, WALK_STEPS, WALK_TOLERANCE } from "./constants";
import { readTrail } from "./readTrail";

export async function walkTo(session: Session, x: number): Promise<void> {
  for (let step = 0; step < WALK_STEPS; step++) {
    const { heroX } = await readTrail(session);
    if (Math.abs(heroX - x) < WALK_TOLERANCE) {
      return;
    }
    await session.press(heroX < x ? KEYS.right : KEYS.left, WALK_STEP_MS);
  }
}
