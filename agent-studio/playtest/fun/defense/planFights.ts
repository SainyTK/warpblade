import type { Session } from "../../types/session";
import { BOSS_CHEST_LEAST, DEFENSE_MODULES, PLAN_STEP_SECONDS } from "./constants";
import type {
  ClockModule,
  DefenseRulesModule,
  EnemiesModule,
  GrowthModule,
  ProgressionModule,
  StageArcModule,
  StageModsModule,
  StagesModule,
  StageTierModule,
  VitalsModule,
} from "./pageModules";
import type { FightKind, FightPlan, PlanStep } from "./types";

export function planFights(
  session: Session,
  stages: readonly string[],
  kinds: readonly FightKind[],
): Promise<FightPlan[]> {
  return session.evaluate(
    async ({ modules, sampled, wanted, stepSeconds, bossChestLeast }) => {
      const [
        rules,
        clock,
        { xpToReach },
        { MAX_LEVEL },
        { STAGES },
        { STAGE_TIER },
        { TIME_TO_KILL },
        { stageMods },
        { SHARD_DROP },
        { ENEMIES },
      ] = (await Promise.all([
        import(modules.defenseRules),
        import(modules.clock),
        import(modules.progression),
        import(modules.growth),
        import(modules.stages),
        import(modules.stageTier),
        import(modules.stageArc),
        import(modules.stageMods),
        import(modules.vitals),
        import(modules.enemies),
      ])) as [
        DefenseRulesModule,
        ClockModule,
        ProgressionModule,
        GrowthModule,
        StagesModule,
        StageTierModule,
        StageArcModule,
        StageModsModule,
        VitalsModule,
        EnemiesModule,
      ];
      const levelAt = (xp: number): number => {
        let level = 1;
        while (level < MAX_LEVEL && xpToReach(level + 1) <= xp + 1e-6) level++;
        return level;
      };
      const eastEvery = rules.SIDE_STYLE.east?.eliteEvery ?? 0;
      const plans: FightPlan[] = [];
      for (const id of sampled) {
        const stage = STAGES[id];
        if (!stage) throw new Error(`No stage "${id}".`);
        const mods = stageMods(stage, false);
        for (const kind of wanted) {
          const call = rules.BIG_FOE_CALLS.find((entry) => entry.kind === kind);
          if (!call) throw new Error(`No ${kind} call in the defense.`);
          const section = Math.ceil(call.at / 60);
          const startAt = (section - 1) * 60;
          const steps: PlanStep[] = [];
          let bonus = 0;
          let elitesSoFar = 0;
          let elitesOpened = 0;
          let minions = 0;
          let elites = 0;
          let bigOnes = 0;
          for (let from = 0; from < startAt; from += stepSeconds) {
            const to = Math.min(startAt, from + stepSeconds);
            for (let second = from; second < to; second++) {
              const count = clock.foesPerSecond(second) * mods.crowd;
              const sides = clock.frontAt(second).sides;
              const east = sides.includes("east") && eastEvery > 0 ? count / sides.length / eastEvery : 0;
              const fresh = count / mods.eliteEvery + east;
              elitesSoFar += fresh;
              elites += fresh;
              minions += count - fresh;
            }
            const eliteChests = Math.floor(elitesSoFar) - elitesOpened;
            elitesOpened += eliteChests;
            const called = rules.BIG_FOE_CALLS.filter((entry) => entry.at >= from && entry.at < to);
            for (const entry of called) {
              bonus +=
                xpToReach(clock.levelAtSecond(entry.at + rules.BIG_FOE_XP_SECONDS[entry.kind])) -
                xpToReach(clock.levelAtSecond(entry.at));
              if (entry.kind === "elite") elites++;
              else bigOnes++;
            }
            const level = levelAt(xpToReach(clock.levelAtSecond(to)) + bonus);
            if (eliteChests > 0) steps.push({ level, chests: eliteChests, least: 1 });
            for (const entry of called) {
              steps.push({ level, chests: 1, least: entry.kind === "boss" ? bossChestLeast : 1 });
            }
            if (eliteChests === 0 && called.length === 0) steps.push({ level, chests: 0, least: 1 });
          }
          const level = levelAt(xpToReach(clock.levelAtSecond(startAt)) + bonus);
          const drops = SHARD_DROP.eliteChance * elites + SHARD_DROP.minionChance * minions;
          const foe = kind === "boss" ? stage.boss : stage.mini.base;
          plans.push({
            id: `${id}-${kind}`,
            stage: id,
            stageName: stage.name,
            kind,
            foe,
            foeName: kind === "mini" ? stage.mini.name : (ENEMIES[foe]?.name ?? foe),
            tier: STAGE_TIER[id],
            callAt: call.at,
            section,
            startAt,
            level,
            hearts: Math.round(bigOnes + drops),
            manas: Math.round(bigOnes + drops),
            steps,
            designedKillSeconds: TIME_TO_KILL[kind] * mods.hp,
          });
        }
      }
      return plans;
    },
    {
      modules: DEFENSE_MODULES,
      sampled: stages,
      wanted: kinds,
      stepSeconds: PLAN_STEP_SECONDS,
      bossChestLeast: BOSS_CHEST_LEAST,
    },
  );
}
