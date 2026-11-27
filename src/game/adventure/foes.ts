import { FOE_BAND } from "../../constants/stageArc";
import { ELITE } from "../../constants/waves";
import type { Enemy, EnemyType } from "../../types/enemy";
import { xpToNext } from "../../utils/progression";
import { bandScale } from "../../utils/stageArc";
import { makeEnemy, makeScaledEnemy } from "../enemies/enemy";
import { game } from "../state";
import { trail } from "./trail";

export function stageFoe(type: EnemyType, x: number, y: number, level: number, xp: number, elite = false): Enemy {
  const run = trail;
  const enemy = run ? makeScaledEnemy(type, x, y, { ...bandScale(level, run.mods), xp }) : makeEnemy(type, x, y, 1);
  if (elite) {
    enemy.elite = true;
    enemy.max = Math.round(enemy.max * ELITE.hp);
    enemy.hp = enemy.max;
  }
  return enemy;
}

export function summonFoe(type: EnemyType, x: number, y: number, xpShare: number): Enemy {
  if (!trail) return makeEnemy(type, x, y, game.wave, xpShare);
  const xp = xpShare * FOE_BAND.summonXpOfLevel * xpToNext(Math.round(trail.band));
  return stageFoe(type, x, y, trail.band, xp);
}

export function claimFoe(enemy: Enemy): Enemy {
  trail?.authored.add(enemy);
  game.enemies.push(enemy);
  return enemy;
}
