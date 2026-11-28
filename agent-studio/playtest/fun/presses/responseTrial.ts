import type { Session } from "../../types/session";
import { ACTION_KEY, KEY_HOLD_MS, PROBE_STEP_MS, RESPONSE_WINDOW_MS } from "./constants";
import { fighterDisturbed } from "./fighterDisturbed";
import { fighterResponded } from "./fighterResponded";
import { readFighter } from "./readFighter";
import type { PressAction, ResponseTiming } from "./types";

export async function responseTrial(session: Session, action: PressAction, phase: number): Promise<ResponseTiming> {
  await session.advance(phase);
  const base = await readFighter(session);
  const t0 = session.elapsedMs();
  await session.keyDown(ACTION_KEY[action]);
  let result: number | null = null;
  let keyUp = false;
  let disturbed = false;
  for (let elapsed = 0; elapsed < RESPONSE_WINDOW_MS; elapsed += PROBE_STEP_MS) {
    await session.advance(PROBE_STEP_MS);
    const cur = await readFighter(session);
    disturbed ||= fighterDisturbed(base, cur);
    if (!keyUp && session.elapsedMs() - t0 >= KEY_HOLD_MS) {
      await session.keyUp(ACTION_KEY[action]);
      keyUp = true;
    }
    if (fighterResponded(base, cur)) {
      result = session.elapsedMs() - t0;
      break;
    }
  }
  await session.keyUp(ACTION_KEY[action]);
  return { ms: result, disturbed };
}
