import { DEFAULT_ROOT } from "../constants/paths";
import type { OpenGameOptions, Session } from "../types/session";
import { launchHarness } from "./harness";

/** the game in its own dev server and browser; close() stops both */
export async function openGame(options: OpenGameOptions = {}): Promise<Session> {
  const harness = await launchHarness(options.root ?? DEFAULT_ROOT);
  try {
    const session = await harness.newSession({ hero: options.hero, viewport: options.viewport });
    return { ...session, close: () => harness.close() };
  } catch (error) {
    await harness.close();
    throw error;
  }
}
