import type { Session } from "../../types/session";
import { FIGHT_MODULES, KEEP_ALIVE_SHARE } from "./constants";
import type { StateModule } from "./pageModules";

export function keepAlive(session: Session): Promise<void> {
  return session.evaluate(
    async ({ path, share }) => {
      const { hero, progress } = (await import(path)) as StateModule;
      hero.hp = Math.max(hero.hp, progress.stats.hp * share);
    },
    { path: FIGHT_MODULES.state, share: KEEP_ALIVE_SHARE },
  );
}
