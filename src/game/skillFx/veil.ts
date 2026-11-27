import { FX_READABILITY as V } from "../../constants/skillFx";
import type { EnemyState } from "../../types/enemy";
import { enemyCenter } from "../enemies/enemy";
import { game } from "../state";

const CALM: ReadonlySet<EnemyState> = new Set(["drift", "walk", "recover"]);

const cache = { at: -1, threats: [] as (readonly [number, number, number])[] };

function threats(): readonly (readonly [number, number, number])[] {
  if (cache.at === game.t) return cache.threats;
  cache.at = game.t;
  cache.threats = [];
  for (const e of game.enemies) {
    if (e.hp <= 0 || e.stun > 0 || e.frozen > 0 || CALM.has(e.state)) continue;
    const [x, y] = enemyCenter(e);
    const reach = V.windupReach * (e.rank === "boss" ? 2 : e.rank === "mini" ? 1.5 : 1);
    cache.threats.push([x, y, reach]);
  }
  return cache.threats;
}

export function threatVeil(x: number, y: number, extent: number, age: number): number {
  if (age < V.grace) return 1;
  for (const [tx, ty, reach] of threats()) {
    const room = extent + reach + V.threatMargin;
    if (Math.abs(tx - x) < room && Math.abs(ty - y) < room) return V.threatVeil;
  }
  return 1;
}
