import type { Session } from "../../types/session";
import { PAGE_MODULES } from "./constants";
import type { GameStateModule, TrailModule } from "./types";

export interface Placement {
  offset: number;
  bossOnly: boolean;
}

export interface PlacementResult {
  maxHp: number;
  trimmed: boolean;
}

export function placeInArea(session: Session, placement: Placement): Promise<PlacementResult> {
  return session.page.evaluate(
    async ({ modules, placement }) => {
      const [{ trail }, { game, hero, progress }] = (await Promise.all([
        import(modules.trail),
        import(modules.state),
      ])) as [TrailModule, GameStateModule];
      if (!trail) {
        return { maxHp: progress.stats.hp, trimmed: false };
      }
      const areas = trail.route.areas;
      const area = areas[trail.area];
      if (!area) {
        return { maxHp: progress.stats.hp, trimmed: false };
      }
      const boss = area.beats.find((beat) => beat.kind === "boss");
      const trimmed = placement.bossOnly && boss !== undefined;
      if (trimmed && boss) {
        areas[trail.area] = { ...area, beats: [boss] };
      }
      trail.pack = area.packs.length;
      trail.hold = null;
      trail.packFoes = [];
      game.enemies = [];
      hero.hp = progress.stats.hp;
      hero.mp = progress.stats.mp;
      Object.assign(hero, { x: area.entrance + placement.offset, vx: 0, vy: 0 });
      return { maxHp: progress.stats.hp, trimmed };
    },
    { modules: PAGE_MODULES, placement },
  );
}
