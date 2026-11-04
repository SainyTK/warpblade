import type { Intent } from "../types/bot";
import type { Session } from "../types/session";

export interface KeyDriver {
  apply(intent: Intent): Promise<void>;
  releaseAll(): Promise<void>;
}

/** turns a bot's intent into real key downs and ups, keeping track of the keys it holds */
export function createKeyDriver(session: Session): KeyDriver {
  const held = new Set<string>();
  const release = async (key: string): Promise<void> => {
    held.delete(key);
    await session.keyUp(key);
  };
  return {
    async apply(intent) {
      for (const key of [...held]) {
        if (!intent.hold.includes(key)) {
          await release(key);
        }
      }
      for (const key of intent.hold) {
        if (!held.has(key)) {
          held.add(key);
          await session.keyDown(key);
        }
      }
      for (const key of intent.tap) {
        if (!held.has(key)) {
          await session.keyDown(key);
          await session.keyUp(key);
        }
      }
    },
    async releaseAll() {
      for (const key of [...held]) {
        await release(key);
      }
    },
  };
}
