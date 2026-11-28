import type { Session } from "../../../types/session";
import { ROOM_ENTRY_OFFSET, ROOM_MODULES } from "../constants";
import type { StageArcModule, StateModule, TrailModule } from "../pageModules";

export interface RoomEntry {
  designedKillSeconds: number;
  heroMaxHp: number;
}

export function enterRoom(session: Session): Promise<RoomEntry> {
  return session.evaluate(
    async ({ modules, offset }) => {
      const [state, { trail }, { TIME_TO_KILL }] = (await Promise.all([
        import(modules.state),
        import(modules.trail),
        import(modules.stageArc),
      ])) as [StateModule, TrailModule, StageArcModule];
      if (!trail) throw new Error("The run is not on a stage.");
      const area = trail.route.areas[trail.area];
      state.hero.hp = state.progress.stats.hp;
      state.hero.mp = state.progress.stats.mp;
      Object.assign(state.hero, { x: area.entrance + offset, vx: 0, vy: 0 });
      return { designedKillSeconds: TIME_TO_KILL.boss * trail.mods.hp, heroMaxHp: state.progress.stats.hp };
    },
    { modules: ROOM_MODULES, offset: ROOM_ENTRY_OFFSET },
  );
}
