import type { Session } from "../../types/session";
import { RECORDING_KEY } from "./constants";
import type { Recording } from "./types";

export function readRecording(session: Session): Promise<Recording> {
  return session.evaluate(
    (key) => (globalThis as unknown as Record<string, Recording>)[key] ?? { hits: [], rewards: [] },
    RECORDING_KEY,
  );
}
