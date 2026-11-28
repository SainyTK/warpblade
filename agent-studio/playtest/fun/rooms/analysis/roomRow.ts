import type { RoomRun } from "../types";
import { round } from "./round";

export interface RoomRow {
  id: string;
  room: string;
  hero: string;
  policy: string;
  level: number;
  ending: string;
  roomSeconds: number;
  fightSeconds: number | null;
  bossHpRemoved: number;
  heroMaxHp: number;
  hpLost: number;
  designedKillSeconds: number;
  wallSeconds: number;
}

export const roomRow = (run: RoomRun): RoomRow => ({
  id: run.id,
  room: run.room,
  hero: run.hero,
  policy: run.policy,
  level: run.level,
  ending: run.ending,
  roomSeconds: run.roomSeconds,
  fightSeconds: run.fightSeconds,
  bossHpRemoved: round(run.bossHpRemoved, 3),
  heroMaxHp: run.setup.heroMaxHp,
  hpLost: round(run.hpLost, 1),
  designedKillSeconds: round(run.setup.designedKillSeconds, 1),
  wallSeconds: run.wallSeconds,
});
