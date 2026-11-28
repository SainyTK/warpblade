import type { Session } from "../../../types/session";
import { FIGHT_MODULES } from "../constants";
import type { ProgressionModule, ProgressModule, StageModsModule, StateModule, WavesModule } from "../pageModules";

export function raiseLevel(session: Session, level: number): Promise<void> {
  return session.evaluate(
    async ({ modules, level }) => {
      const [state, progress, { xpToReach }, { bandWave }, { STAGE_WAVES }] = (await Promise.all([
        import(modules.state),
        import(modules.progress),
        import(modules.progression),
        import(modules.stageMods),
        import(modules.waves),
      ])) as [StateModule, ProgressModule, ProgressionModule, StageModsModule, WavesModule];
      const need = xpToReach(level) - (xpToReach(state.progress.level) + state.progress.xp);
      if (need > 0) progress.gainXp(need);
      state.game.wave = Math.max(1, Math.min(STAGE_WAVES, Math.round(bandWave(level))));
    },
    { modules: FIGHT_MODULES, level },
  );
}
