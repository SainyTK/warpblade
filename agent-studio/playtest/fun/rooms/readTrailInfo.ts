import type { Session } from "../../types/session";
import { ROOM_MODULES } from "./constants";
import type { StateModule, TrailModule } from "./pageModules";
import type { TrailInfo } from "./types";

export function readTrailInfo(session: Session): Promise<TrailInfo> {
  return session.evaluate(
    async ({ modules }) => {
      const [{ game, hero, progress }, { trail }] = (await Promise.all([
        import(modules.state),
        import(modules.trail),
      ])) as [StateModule, TrailModule];
      return {
        gate: trail?.gate ?? null,
        bossHp: trail?.bigFoe ? trail.bigFoe.hp : null,
        bossMax: trail?.bigFoe ? trail.bigFoe.max : null,
        mode: game.mode,
        heroX: hero.x,
        heroY: hero.y,
        heroHp: hero.hp,
        heroMaxHp: progress.stats.hp,
        dead: hero.state === "dead" || hero.hp <= 0,
        won: trail?.finale ?? false,
      };
    },
    { modules: ROOM_MODULES },
  );
}
