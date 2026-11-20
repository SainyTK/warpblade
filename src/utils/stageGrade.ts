import type { StageGrade } from "../types/run";

interface StageGradeInput {
  cleared: boolean;
  seconds: number;
  parSeconds: number;
  bossesDefeated: number;
  bossesTotal: number;
  foesDefeated: number;
  foesTotal: number;
  damageCoverage: number;
}

const MIN_S_DAMAGE_COVERAGE = 0.9;
const MIN_S_FOE_SHARE = 0.85;

export function stageGrade(run: StageGradeInput): StageGrade {
  if (run.cleared) {
    const onPace = run.seconds <= run.parSeconds;
    const enoughFoes = run.foesDefeated >= run.foesTotal * MIN_S_FOE_SHARE;
    const enoughDamage = run.damageCoverage >= MIN_S_DAMAGE_COVERAGE;
    return onPace && enoughFoes && enoughDamage ? "S" : "A";
  }
  if (run.bossesDefeated === 0) return "E";
  if (run.bossesDefeated * 3 <= run.bossesTotal) return "D";
  if (run.bossesDefeated * 3 <= run.bossesTotal * 2) return "C";
  return "B";
}
