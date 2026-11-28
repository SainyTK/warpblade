import type { FightRun, StageRun } from "../types";
import { type ClearRate, clearRate } from "./clearRate";
import { type Escalation, escalation } from "./escalation";
import { type FairHits, fairHits } from "./fairHits";
import { type FightLength, fightLength } from "./fightLength";
import { type FightRow, fightRow } from "./fightRow";
import { type RewardRhythm, rewardRhythm } from "./rewardRhythm";
import { type SkillGap, skillGap } from "./skillGap";

export interface FightsSummary {
  clearRate: ClearRate;
  fairHits: FairHits;
  escalation: Escalation;
  fightLength: FightLength;
  skillGap: SkillGap;
  rewardRhythm: RewardRhythm;
  fights: FightRow[];
  stages: {
    id: string;
    ending: string;
    seconds: number;
    level: number;
    falls: number;
    crystalShare: number;
    rewards: number;
    wallSeconds: number;
  }[];
  failed: string[];
}

export function summarize(fights: readonly FightRun[], stages: readonly StageRun[], failed: string[]): FightsSummary {
  return {
    clearRate: clearRate(fights),
    fairHits: fairHits(fights),
    escalation: escalation(fights),
    fightLength: fightLength(fights),
    skillGap: skillGap(fights),
    rewardRhythm: rewardRhythm(stages),
    fights: fights.map(fightRow),
    stages: stages.map((run) => ({
      id: run.id,
      ending: run.ending,
      seconds: run.seconds,
      level: run.level,
      falls: run.falls,
      crystalShare: run.crystalShare,
      rewards: run.rewards.length,
      wallSeconds: run.wallSeconds,
    })),
    failed,
  };
}
