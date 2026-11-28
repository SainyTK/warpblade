import type { RoomRun, StageRun } from "../types";
import { type ClearRate, clearRate } from "./clearRate";
import { type Escalation, escalation } from "./escalation";
import { type FairHits, fairHits } from "./fairHits";
import { type FightLength, fightLength } from "./fightLength";
import { type RewardRhythm, rewardRhythm } from "./rewardRhythm";
import { type RoomRow, roomRow } from "./roomRow";
import { type SkillGap, skillGap } from "./skillGap";

export interface RoomsSummary {
  clearRate: ClearRate;
  fairHits: FairHits;
  escalation: Escalation;
  fightLength: FightLength;
  skillGap: SkillGap;
  rewardRhythm: RewardRhythm;
  rooms: RoomRow[];
  stages: { id: string; ending: string; seconds: number; level: number; rewards: number; wallSeconds: number }[];
  failed: string[];
}

export function summarize(rooms: readonly RoomRun[], stages: readonly StageRun[], failed: string[]): RoomsSummary {
  return {
    clearRate: clearRate(rooms),
    fairHits: fairHits(rooms),
    escalation: escalation(rooms),
    fightLength: fightLength(rooms),
    skillGap: skillGap(rooms),
    rewardRhythm: rewardRhythm(stages),
    rooms: rooms.map(roomRow),
    stages: stages.map((run) => ({
      id: run.id,
      ending: run.ending,
      seconds: run.seconds,
      level: run.level,
      rewards: run.rewards.length,
      wallSeconds: run.wallSeconds,
    })),
    failed,
  };
}
