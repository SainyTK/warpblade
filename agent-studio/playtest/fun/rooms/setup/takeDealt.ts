import type { Session } from "../../../types/session";
import { DEALT_KEY, ROOM_MODULES } from "../constants";
import type { PickAnswerModule } from "../pageModules";

export function takeDealt(session: Session, index: number): Promise<void> {
  return session.evaluate(
    async ({ path, key, index }) => {
      const { answerPick } = (await import(path)) as PickAnswerModule;
      const dealt = (globalThis as unknown as Record<string, unknown[]>)[key] ?? [];
      answerPick({ t: "take", card: dealt[index] });
    },
    { path: ROOM_MODULES.progress, key: DEALT_KEY, index },
  );
}
