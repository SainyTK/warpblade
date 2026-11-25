import { SURGE } from "../../constants/campaign";
import { ELITE } from "../../constants/waves";
import type { EnemyType } from "../../types/enemy";
import { createRift } from "../effects/rift";
import { makeEnemy } from "../enemies/enemy";
import { kindOf } from "../enemies/kinds";
import { game, hero } from "../state";
import { type RouteArea, STAGE_XP } from "./route";
import { type Surge, trail } from "./trail";

function surgeFoes(kinds: readonly EnemyType[], count: number): EnemyType[] {
  const random = trail?.random;
  return Array.from({ length: count }, () => (random ? random.pick(kinds) : kinds[0]));
}

export function openSurge(area: RouteArea): Surge | null {
  const run = trail;
  if (!run || area.room.kind !== "surge") return null;
  const stage = run.route.stage;
  const kinds = area.room.foes ?? [stage.ground, stage.flyer];
  const growth = Math.max(0, area.threat - SURGE.growsFromThreat);
  const count = Math.round(area.room.count * (1 + SURGE.countPerThreat * growth));
  const cap = Math.min(SURGE.mostCap, Math.round(area.room.cap * SURGE.baseCapShare + SURGE.capPerThreat * growth));
  const surge: Surge = { foes: surgeFoes(kinds, count), sent: 0, cap, refills: [] };
  for (let i = 0; i < Math.min(surge.cap, surge.foes.length); i++) surge.refills.push(i * SURGE.opening);
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
  const type = surge.foes[surge.sent];
  const elite = surge.sent > 0 && surge.sent % SURGE.eliteEvery === 0;
  surge.sent++;
  const rift = kindOf(type).rift;
  const x = spawnX(area);
  const y = rift.y();
  game.fx.push(
    createRift(x, rift.riftY(y), rift.height, 0, () => {
      const enemy = makeEnemy(type, x, y, area.threat, STAGE_XP);
      enemy.power *= trail?.route.stage.foeDamage ?? 1;
      enemy.max = Math.round(enemy.max * area.hpScale);
      enemy.hp = enemy.max;
      if (elite) {
        Object.assign(enemy, { elite, max: Math.round(enemy.max * ELITE.hp), xp: Math.round(enemy.xp * ELITE.xp) });
        enemy.hp = enemy.max;
      }
      trail?.authored.add(enemy);
      game.enemies.push(enemy);
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
  const free = Math.min(surge.cap - standing - surge.refills.length, left - surge.refills.length);
  for (let i = 0; i < free; i++) surge.refills.push(SURGE.refill);
  for (let i = 0; i < surge.refills.length; i++) surge.refills[i] -= dt;
  const due = surge.refills.filter((t) => t <= 0).length;
  surge.refills = surge.refills.filter((t) => t > 0);
  for (let i = 0; i < due && surge.sent < surge.foes.length; i++) sendFoe(surge, area);
  return surge.sent >= surge.foes.length && standing === 0 && surge.refills.length === 0;
}

export const surgeLeft = (surge: Surge): number =>
  surge.foes.length - surge.sent + game.enemies.filter((e) => e.hp > 0).length;
