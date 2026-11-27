import { FOE_BAND, OFF_LADDER_HITS } from "../../constants/stageArc";
import { ELITE } from "../../constants/waves";
import type { LadderFoe } from "../../types/campaign";
import type { Enemy, EnemyType } from "../../types/enemy";
import { ladderEntry } from "../../utils/ladder";
import { xpToNext } from "../../utils/progression";
import { bandDamage, ladderHp } from "../../utils/stageArc";
import { coop } from "../coopHooks";
import { makeEnemy, makeFoe } from "../enemies/enemy";
import { game } from "../state";
import { trail } from "./trail";

function entryFor(type: EnemyType, level: number): LadderFoe {
  const ladder = trail?.route.stage.ladder ?? [];
  const known = ladderEntry(ladder, type);
  if (known) return known;
  const rung = Math.max(1, ...ladder.filter((entry) => entry.level <= level).map((entry) => entry.level));
  return { foe: type, level: rung, hits: OFF_LADDER_HITS };
}

export function stageFoe(type: EnemyType, x: number, y: number, level: number, xp: number, elite = false): Enemy {
  const run = trail;
  if (!run) return makeEnemy(type, x, y, 1);
  const hp = Math.round(ladderHp(entryFor(type, level), run.mods) * (elite ? ELITE.hp : 1));
  const enemy = makeFoe(type, x, y, { hp, damage: bandDamage(level, run.mods), xp });
  enemy.elite = elite;
  const room = coop();
  if (room) enemy.hp = enemy.max = room.scaleFoeHp(enemy.rank, enemy.max);
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
