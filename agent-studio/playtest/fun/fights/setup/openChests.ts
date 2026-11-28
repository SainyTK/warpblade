import type { Session } from "../../../types/session";
import type { PlanStep } from "../../defense";
import { FIGHT_MODULES } from "../constants";
import type { BuildStatsModule, ChestsModule, ProgressModule, RaiseModule, StateModule } from "../pageModules";

export function openChests(session: Session, step: PlanStep): Promise<string[]> {
  return session.evaluate(
    async ({ modules, chests, least }) => {
      const [state, progress, raise, { rollChest }, { currentBuildStats }] = (await Promise.all([
        import(modules.state),
        import(modules.progress),
        import(modules.raise),
        import(modules.chests),
        import(modules.buildStats),
      ])) as [StateModule, ProgressModule, RaiseModule, ChestsModule, BuildStatsModule];
      const opened: string[] = [];
      for (let chest = 0; chest < chests; chest++) {
        const luck = currentBuildStats().luck;
        const rewards = rollChest(state.character, state.progress.build, state.game.wave, luck, state.rng, least);
        for (const reward of rewards) {
          if (reward.type === "heal") continue;
          if (reward.type === "evolve") raise.evolveSkill(reward.id);
          else if (reward.type === "skill") raise.raiseSkill(reward.id);
          else if (reward.type === "art") raise.raiseArt(reward.id);
          else raise.raiseMastery(reward.id);
          opened.push(`${reward.type}:${reward.id}`);
        }
        progress.refreshGrowing();
      }
      return opened;
    },
    { modules: FIGHT_MODULES, chests: step.chests, least: step.least },
  );
}
