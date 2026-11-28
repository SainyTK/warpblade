import type { Session } from "../../../types/session";
import { FIGHT_MODULES } from "../constants";
import type { ProgressModule, StateModule } from "../pageModules";

export function grantShards(session: Session, hearts: number, manas: number): Promise<number> {
  return session.evaluate(
    async ({ modules, hearts, manas }) => {
      const [state, progress] = (await Promise.all([import(modules.state), import(modules.progress)])) as [
        StateModule,
        ProgressModule,
      ];
      state.progress.heartShards = hearts;
      state.progress.manaShards = manas;
      progress.refreshGrowing();
      state.hero.hp = state.progress.stats.hp;
      state.hero.mp = state.progress.stats.mp;
      return state.progress.stats.hp;
    },
    { modules: FIGHT_MODULES, hearts, manas },
  );
}
