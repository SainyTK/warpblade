import type { StageGrade } from "../types/run";

interface StageGradeInput {
  cleared: boolean;
  seconds: number;
  parSeconds: number;
  distance: number;
  miniDefeated: boolean;
  foesDefeated: number;
  foesTotal: number;
  damageCoverage: number;
}

const MIN_S_DAMAGE_COVERAGE = 0.9;
const MIN_S_FOE_SHARE = 0.85;
const FALLEN_GRADES: readonly (readonly [distance: number, grade: StageGrade])[] = [
  [0.75, "B"],
  [0.5, "C"],
  [0.25, "D"],
];

export function stageGrade(run: StageGradeInput): StageGrade {
  if (run.cleared) {
    const onPace = run.seconds <= run.parSeconds;
    const enoughFoes = run.foesDefeated >= run.foesTotal * MIN_S_FOE_SHARE;
    const enoughDamage = run.damageCoverage >= MIN_S_DAMAGE_COVERAGE;
    return onPace && enoughFoes && enoughDamage ? "S" : "A";
  }
  const reach = run.miniDefeated ? Math.max(run.distance, 0.5) : run.distance;
  return FALLEN_GRADES.find(([distance]) => reach >= distance)?.[1] ?? "E";
}
