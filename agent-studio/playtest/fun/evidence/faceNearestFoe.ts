import { KEYS } from "../../constants/keys";
import type { Session } from "../../types/session";
import type { FoeSnapshot } from "../../types/snapshot";
import { FACE_GAP, FACE_RANGE } from "./constants";
import { walkTo } from "./walkTo";

const TURN_MS = 16;

export async function faceNearestFoe(
  session: Session,
  fits: (foe: FoeSnapshot) => boolean = () => true,
): Promise<void> {
  const { hero, enemies } = await session.state();
  const byDistance = enemies
    .filter((e) => e.hp > 0 && fits(e))
    .sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  const foe = byDistance.find((e) => !e.air) ?? byDistance[0];
  if (!foe) {
    return;
  }
  const dx = foe.x - hero.x;
  if (Math.abs(dx) > FACE_RANGE) {
    await walkTo(session, foe.x - Math.sign(dx) * FACE_GAP);
  }
  await session.press(dx > 0 ? KEYS.right : KEYS.left, TURN_MS);
}
