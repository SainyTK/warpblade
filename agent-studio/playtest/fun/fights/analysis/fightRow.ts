import type { FightRun } from "../types";
import { round } from "./round";

export interface FightRow {
  id: string;
  fight: string;
  hero: string;
  policy: string;
  level: number;
  ending: string;
  arrivedAt: number | null;
  fightSeconds: number | null;
  bossHpRemoved: number;
  heroMaxHp: number;
  hpLost: number;
  falls: number;
  crystalLost: number;
  designedKillSeconds: number;
  wallSeconds: number;
}

export const fightRow = (run: FightRun): FightRow => ({
  id: run.id,
  fight: run.fight,
  hero: run.hero,
  policy: run.policy,
  level: run.setup.level,
  ending: run.ending,
  arrivedAt: run.arrivedAt,
  fightSeconds: run.fightSeconds,
  bossHpRemoved: round(run.bossHpRemoved, 3),
  heroMaxHp: run.setup.heroMaxHp,
  hpLost: round(run.hpLost, 1),
  falls: run.falls,
  crystalLost: round(run.crystalLost, 3),
  designedKillSeconds: round(run.designedKillSeconds, 1),
  wallSeconds: run.wallSeconds,
});
