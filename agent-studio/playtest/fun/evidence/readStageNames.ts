import type { Session } from "../../types/session";
import { PAGE_MODULES } from "./constants";
import type { EnemiesModule, StageNames, TrailModule } from "./types";

export function readStageNames(session: Session): Promise<StageNames> {
  return session.page.evaluate(async (modules) => {
    const [{ trail }, { ENEMIES }] = (await Promise.all([import(modules.trail), import(modules.enemies)])) as [
      TrailModule,
      EnemiesModule,
    ];
    const stage = trail?.route.stage;
    return { stage: stage?.name ?? "", boss: stage ? (ENEMIES[stage.boss]?.name ?? stage.boss) : "" };
  }, PAGE_MODULES);
}
