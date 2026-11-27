import { SURGE } from "../../constants/campaign";
import type { EnemyType } from "../../types/enemy";
import { levelBetween, xpBudget } from "../../utils/stageArc";
import { createRift } from "../effects/rift";
import { kindOf } from "../enemies/kinds";
import { game, hero } from "../state";
import { claimFoe, stageFoe } from "./foes";
import { foeWeight, type RouteArea, type SurgeBeat } from "./route";
import { type Surge, trail } from "./trail";

const isElite = (index: number): boolean => index > 0 && index % (trail?.mods.eliteEvery ?? SURGE.eliteEvery) === 0;

export function openSurge(beat: SurgeBeat): Surge {
  const random = trail?.random;
  const foes = Array.from({ length: beat.count }, () => (random ? random.pick(beat.foes) : beat.foes[0]));
  const levels = foes.map((_, i) => levelBetween(beat.from, beat.to, i / Math.max(1, foes.length - 1)));
  const xp = xpBudget(
    beat.from,
    beat.to,
    foes.map((type, i) => ({ level: levels[i], weight: foeWeight(type, isElite(i)) })),
  );
  const surge: Surge = { beat, foes, levels, xp, sent: 0, refills: [] };
  for (let i = 0; i < Math.min(beat.cap, foes.length); i++) surge.refills.push(i * SURGE.opening);
  return surge;
}

function spawnX(area: RouteArea): number {
  const random = trail?.random;
  const left = area.entrance + SURGE.spawnMargin;
  const right = area.exit - SURGE.spawnMargin;
  for (let tries = 0; tries < 8; tries++) {
    const x = random ? random.range(left, right) : (left + right) / 2;
    if (Math.abs(x - hero.x) >= SURGE.heroGap) return x;
  }
  return hero.x < (left + right) / 2 ? right : left;
}

function sendFoe(surge: Surge, area: RouteArea): void {
  const index = surge.sent;
  const type: EnemyType = surge.foes[index];
  surge.sent++;
  const rift = kindOf(type).rift;
  const x = spawnX(area);
  const y = rift.y();
  if (trail) trail.band = surge.levels[index];
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, 0, () => {
      claimFoe(stageFoe(type, x, y, surge.levels[index], surge.xp[index], isElite(index)));
    }),
  );
}

function drawStragglersDown(dt: number): void {
  for (const enemy of game.enemies) {
    if (enemy.hp <= 0 || enemy.air || !kindOf(enemy.type).flies || enemy.y >= SURGE.reachableY) continue;
    enemy.y = Math.min(SURGE.reachableY, enemy.y + SURGE.stragglerSink * dt);
  }
}

export function updateSurge(surge: Surge, area: RouteArea, dt: number): boolean {
  if (surge.sent >= surge.foes.length) drawStragglersDown(dt);
  const standing = game.enemies.filter((e) => e.hp > 0).length + game.fx.filter((f) => f.rift).length;
  const left = surge.foes.length - surge.sent;
  const free = Math.min(surge.beat.cap - standing - surge.refills.length, left - surge.refills.length);
  for (let i = 0; i < free; i++) surge.refills.push(SURGE.refill);
  for (let i = 0; i < surge.refills.length; i++) surge.refills[i] -= dt;
  const due = surge.refills.filter((t) => t <= 0).length;
  surge.refills = surge.refills.filter((t) => t > 0);
  for (let i = 0; i < due && surge.sent < surge.foes.length; i++) sendFoe(surge, area);
  return surge.sent >= surge.foes.length && standing === 0 && surge.refills.length === 0;
}

export function surgeEnding(): boolean {
  const surge = trail?.surge;
  if (!surge || surge.sent < surge.foes.length || surge.refills.length > 0) return false;
  return game.enemies.every((e) => e.hp <= 0) && !game.fx.some((f) => f.rift);
}
