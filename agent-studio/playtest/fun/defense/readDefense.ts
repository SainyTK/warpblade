import type { Session } from "../../types/session";
import { CRYSTAL_STRUCK_SECONDS, DEFENSE_MODULES } from "./constants";
import type { DefenseModule, EnemiesModule, StateModule } from "./pageModules";
import type { DefenseView } from "./types";

export function readDefense(session: Session): Promise<DefenseView> {
  return session.evaluate(
    async ({ modules, struckSeconds }) => {
      const [{ game, hero, progress }, { defense }, { ENEMIES }] = (await Promise.all([
        import(modules.state),
        import(modules.defense),
        import(modules.enemies),
      ])) as [StateModule, DefenseModule, EnemiesModule];
      const crystal = defense?.crystal;
      return {
        stage: defense?.stage.id ?? null,
        stageName: defense?.stage.name ?? "",
        bossName: defense ? (ENEMIES[defense.stage.boss]?.name ?? defense.stage.boss) : "",
        elapsed: defense?.elapsed ?? 0,
        end: defense?.end ?? null,
        crystalShare: crystal ? Math.max(0, crystal.hp) / crystal.max : 0,
        crystalStruck: crystal ? game.t - crystal.lastHitAt < struckSeconds : false,
        crystalX: crystal?.x ?? 0,
        bigFoes: (defense?.bigFoes ?? []).map(({ foe, kind }) => ({ kind, type: foe.type, hp: foe.hp, max: foe.max })),
        mode: game.mode,
        heroX: hero.x,
        heroY: hero.y,
        heroHp: hero.hp,
        heroMaxHp: progress.stats.hp,
        dead: hero.state === "dead" || hero.hp <= 0,
        picks: progress.picks,
        level: progress.level,
      };
    },
    { modules: DEFENSE_MODULES, struckSeconds: CRYSTAL_STRUCK_SECONDS },
  );
}
