import type { Session } from "../../../types/session";
import { ROOM_MODULES } from "../constants";
import type { StateModule, TrailModule } from "../pageModules";

export function cutToBossRoom(session: Session, boss: string): Promise<void> {
  return session.evaluate(
    async ({ modules, boss }) => {
      const [state, { trail }] = (await Promise.all([import(modules.state), import(modules.trail)])) as [
        StateModule,
        TrailModule,
      ];
      if (!trail) throw new Error("The run is not on a stage.");
      const area = trail.route.areas[trail.area];
      const beat = area.beats.find((b) => b.kind === "boss" && b.foe === boss);
      if (!beat) throw new Error(`No ${boss} beat in area ${trail.area + 1}.`);
      (trail.route.areas as unknown[])[trail.area] = { ...area, beats: [beat] };
      trail.pack = area.packs.length;
      trail.hold = null;
      trail.packFoes = [];
      state.game.enemies = [];
    },
    { modules: ROOM_MODULES, boss },
  );
}
