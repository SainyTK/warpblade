import type { EnemyKind } from "../../../../game/enemies/kinds/kind";
import type { Enemy } from "../../../../types/enemy";
import { burstWard } from "./burst";
import { spendWard, WARD, warded } from "./store";

export function wardedDamage(e: Enemy, dmg: number, loud: boolean): number {
  if (!warded(e)) return dmg;
  if (loud && spendWard(e)) burstWard(e);
  return dmg * WARD.share;
}

export function withWard(kind: EnemyKind): EnemyKind {
  const takes = kind.takes;
  return {
    ...kind,
    takes: (e, dmg, loud) => wardedDamage(e, takes ? takes(e, dmg, loud) : dmg, loud),
  };
}

export function wardKinds<K extends string>(kinds: Record<K, EnemyKind>): Record<K, EnemyKind> {
  const wrapped = {} as Record<K, EnemyKind>;
  for (const id of Object.keys(kinds) as K[]) wrapped[id] = withWard(kinds[id]);
  return wrapped;
}
