import { SMOKE_KNOT } from "../../../constants/tallis/abilities";
import type { Enemy } from "../../../types/enemy";
import type { SmokeCloud } from "../../../types/tallis";
import { enemyCenter } from "../../enemies/enemy";
import { game, hero } from "../../state";
import { tallisHost } from "./memory";

/** a point inside a cloud's body */
const inside = (c: SmokeCloud, x: number, y: number): boolean =>
  Math.abs(x - c.x) <= c.w / 2 && y <= c.y + 2 && y >= c.y - c.h;

/** he stands in one of his own Smoke Knots */
export const inCloud = (): boolean => tallisHost.clouds.some((c) => inside(c, hero.x, hero.y - 12));

/** a foe stands in one of his clouds */
export function foeInCloud(e: Enemy): boolean {
  const [cx, cy] = enemyCenter(e);
  return tallisHost.clouds.some((c) => inside(c, cx, cy));
}

/** a cloud rises where he dropped the knot */
export function raiseCloud(x: number, y: number, w: number, h: number, life: number): void {
  tallisHost.clouds.push({ x, y, w, h, t: 0, life });
}

/** the clouds stand their time; minions and elites inside are blind while they are inside */
export function stepClouds(dt: number): void {
  for (const c of tallisHost.clouds) c.t += dt;
  tallisHost.clouds = tallisHost.clouds.filter((c) => c.t < c.life);
  if (!tallisHost.clouds.length) return;
  for (const e of game.enemies)
    if (e.hp > 0 && e.rank === "minion" && foeInCloud(e)) e.blind = Math.max(e.blind, SMOKE_KNOT.blind);
}

export function clearClouds(): void {
  tallisHost.clouds = [];
}
