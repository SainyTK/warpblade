import { KEYS } from "../../constants/keys";
import type { Session } from "../../types/session";
import { WALK_STEP_MS, WALK_STEPS, WALK_TOLERANCE } from "./constants";

export async function walkTo(session: Session, x: number): Promise<void> {
  for (let step = 0; step < WALK_STEPS; step++) {
    const { hero } = await session.state();
    if (Math.abs(hero.x - x) < WALK_TOLERANCE) {
      return;
    }
    await session.press(hero.x < x ? KEYS.right : KEYS.left, WALK_STEP_MS);
  }
}
