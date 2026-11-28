import type { Session } from "../../types/session";
import { PAGE_MODULES } from "./constants";
import type { GameStateModule } from "./types";

export function leaveOneHp(session: Session): Promise<void> {
  return session.page.evaluate(async (modules) => {
    const { hero } = (await import(modules.state)) as GameStateModule;
    hero.hp = 1;
  }, PAGE_MODULES);
}
