export const DEFENSE_MODULES = {
  state: "/src/game/state.ts",
  progress: "/src/game/progress.ts",
  defense: "/src/game/adventure/defense.ts",
  defenseRules: "/src/constants/defense.ts",
  clock: "/src/utils/defenseClock.ts",
  progression: "/src/utils/progression.ts",
  growth: "/src/constants/growth.ts",
  stages: "/src/stages/index.ts",
  stageTier: "/src/constants/stageGraph.ts",
  stageArc: "/src/constants/stageArc.ts",
  stageMods: "/src/utils/stageArc.ts",
  vitals: "/src/constants/vitals.ts",
  enemies: "/src/constants/enemies.ts",
} as const;

export const CRYSTAL_STRUCK_SECONDS = 0.3;
export const PLAN_STEP_SECONDS = 60;
export const BOSS_CHEST_LEAST = 3;
