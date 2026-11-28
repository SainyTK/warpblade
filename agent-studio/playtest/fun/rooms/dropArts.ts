import type { Session } from "../../types/session";
import { ROOM_MODULES } from "./constants";
import type { ProgressModule, StateModule } from "./pageModules";

export function dropArts(session: Session): Promise<void> {
  return session.evaluate(
    async ({ modules }) => {
      const [state, progress] = (await Promise.all([import(modules.state), import(modules.progress)])) as [
        StateModule,
        ProgressModule,
      ];
      state.progress.build.arts = {};
      progress.refreshGrowing();
    },
    { modules: ROOM_MODULES },
  );
}
