import type { Session } from "../../types/session";
import { BOSS_CHEST_LEAST, PLAN_SEED, ROOM_MODULES } from "./constants";
import type {
  EnemiesModule,
  GrowthModule,
  ProgressionModule,
  RngModule,
  RouteModule,
  StageModsModule,
  StagesModule,
  StageTierModule,
  VitalsModule,
} from "./pageModules";
import type { PlanStep, RoomPlan } from "./types";

export function planRooms(session: Session, stages: readonly string[]): Promise<RoomPlan[]> {
  return session.evaluate(
    async ({ modules, seed, bossChestLeast, sampled }) => {
      const [
        { buildRoute },
        { STAGES },
        { STAGE_TIER },
        mods,
        { SHARD_DROP },
        { ENEMIES },
        { xpToReach },
        { Rng },
        { MAX_LEVEL },
      ] = (await Promise.all([
        import(modules.route),
        import(modules.stages),
        import(modules.stageTier),
        import(modules.stageMods),
        import(modules.vitals),
        import(modules.enemies),
        import(modules.progression),
        import(modules.rng),
        import(modules.growth),
      ])) as [
        RouteModule,
        StagesModule,
        StageTierModule,
        StageModsModule,
        VitalsModule,
        EnemiesModule,
        ProgressionModule,
        RngModule,
        GrowthModule,
      ];
      const levelAt = (xp: number): number => {
        let level = 1;
        while (level < MAX_LEVEL && xpToReach(level + 1) <= xp + 1e-6) level++;
        return level;
      };
      const plans: RoomPlan[] = [];
      for (const id of sampled) {
        const stage = STAGES[id];
        if (!stage) throw new Error(`No stage "${id}".`);
        let found: RoomPlan | null = null;
        const stageMods = mods.stageMods(stage, false);
        const route = buildRoute(stage, stageMods, new Rng(seed));
        let xp = 0;
        let elites = 0;
        let minions = 0;
        let surgeEnds = 0;
        let bigs = 0;
        const steps: PlanStep[] = [];
        for (const [areaIndex, area] of route.areas.entries()) {
          for (const pack of area.packs) {
            if (pack.mini) {
              xp += pack.mini.xp;
              bigs++;
              steps.push({ level: levelAt(xp), chests: 1, least: 1 });
            }
            const packElites = pack.foes.filter((foe) => foe.elite).length;
            for (const foe of pack.foes) xp += foe.xp;
            elites += packElites;
            minions += pack.foes.length - packElites;
            if (pack.foes.length > 0) steps.push({ level: levelAt(xp), chests: packElites, least: 1 });
          }
          for (const beat of area.beats) {
            if (beat.kind === "surge") {
              const total = beat.waves.reduce((sum, size) => sum + size, 0);
              const surgeElites = Math.floor((total - 1) / stageMods.eliteEvery);
              xp = xpToReach(beat.to);
              elites += surgeElites;
              minions += total - surgeElites;
              surgeEnds++;
              steps.push({ level: levelAt(xp), chests: surgeElites, least: 1 });
              continue;
            }
            if (beat.kind === "boss") {
              const chance = SHARD_DROP.eliteChance * elites + SHARD_DROP.minionChance * minions;
              found = {
                id: `${id}-${beat.foe}`,
                stage: id,
                stageName: stage.name,
                boss: beat.foe,
                bossName: ENEMIES[beat.foe]?.name ?? beat.foe,
                tier: STAGE_TIER[id],
                section: areaIndex + 1,
                level: levelAt(xp),
                hearts: Math.round(surgeEnds + bigs + chance),
                manas: Math.round(bigs + chance),
                steps: steps.map((step) => ({ ...step })),
              };
            }
            xp += beat.xp;
            if (beat.kind === "elite") elites++;
            else bigs++;
            steps.push({ level: levelAt(xp), chests: 1, least: beat.kind === "boss" ? bossChestLeast : 1 });
          }
        }
        if (!found) throw new Error(`No boss room in stage "${id}".`);
        plans.push(found);
      }
      return plans;
    },
    { modules: ROOM_MODULES, seed: PLAN_SEED, bossChestLeast: BOSS_CHEST_LEAST, sampled: stages },
  );
}
