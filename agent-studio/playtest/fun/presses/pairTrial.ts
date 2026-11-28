import type { Session } from "../../types/session";
import { actionStarted } from "./actionStarted";
import { ACTION_KEY, EARLY_SECOND_MS, KEY_HOLD_MS, PAIR_WINDOW_MS, PROBE_STEP_MS, SECOND_WINDOW_MS } from "./constants";
import { fighterBusy } from "./fighterBusy";
import { fighterDisturbed } from "./fighterDisturbed";
import { readFighter } from "./readFighter";
import type { FighterProbe, PairTrial, PressAction, PressTiming } from "./types";

export async function pairTrial(
  session: Session,
  hero: string,
  first: PressAction,
  second: PressAction,
  timing: PressTiming,
): Promise<PairTrial> {
  const base = await readFighter(session);
  const t0 = session.elapsedMs();
  await session.keyDown(ACTION_KEY[first]);
  let prev = base;
  let firstStarted = false;
  let firstEnded = false;
  let firstKeyUp = false;
  let firstSeen: FighterProbe | null = null;
  let secondPressedAt: number | null = null;
  let secondStarted = false;
  let secondAtMs: number | null = null;
  let disturbed = false;
  for (let elapsed = 0; elapsed < PAIR_WINDOW_MS; elapsed += PROBE_STEP_MS) {
    await session.advance(PROBE_STEP_MS);
    const cur = await readFighter(session);
    disturbed ||= fighterDisturbed(base, cur);
    if (!firstKeyUp && elapsed + PROBE_STEP_MS >= KEY_HOLD_MS) {
      await session.keyUp(ACTION_KEY[first]);
      firstKeyUp = true;
    }
    if (!firstStarted && actionStarted(first, prev, cur, base)) {
      firstStarted = true;
      firstSeen = cur;
    }
    if (firstStarted && !firstEnded && secondPressedAt === null && !fighterBusy(cur)) {
      firstEnded = true;
    }
    const due = timing === "100ms" ? session.elapsedMs() - t0 >= EARLY_SECOND_MS : firstEnded;
    if (secondPressedAt === null && firstKeyUp && due && (timing === "100ms" || firstStarted)) {
      secondPressedAt = session.elapsedMs();
      await session.keyDown(ACTION_KEY[second]);
      prev = await readFighter(session);
      continue;
    }
    if (secondPressedAt !== null) {
      if (session.elapsedMs() - secondPressedAt >= KEY_HOLD_MS) {
        await session.keyUp(ACTION_KEY[second]);
      }
      const fresh = actionStarted(second, prev, cur, base) && !(first === second && cur === firstSeen);
      if (!secondStarted && fresh) {
        secondStarted = true;
        secondAtMs = session.elapsedMs() - secondPressedAt;
      }
      if (secondStarted || session.elapsedMs() - secondPressedAt > SECOND_WINDOW_MS) {
        break;
      }
    }
    prev = cur;
  }
  await session.keyUp(ACTION_KEY[first]);
  await session.keyUp(ACTION_KEY[second]);
  return {
    pair: `${first}>${second}`,
    hero,
    timing,
    firstStarted,
    secondStarted,
    secondAtMs,
    mpBefore: base.mp,
    disturbed,
    retried: false,
  };
}
