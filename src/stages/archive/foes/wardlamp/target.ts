import { game, hero } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { wardHolds } from "../lampWard";
import { WARDLAMP } from "./moves";

const chosen = new WeakMap<Enemy, Enemy>();

export function pickWardTarget(lamp: Enemy): Enemy | null {
  const allies = game.enemies.filter(
    (o) =>
      o !== lamp &&
      o.hp > 0 &&
      o.rank === "minion" &&
      o.type !== "wardlamp" &&
      !wardHolds(o) &&
      Math.abs(o.x - lamp.x) < WARDLAMP.wardReach,
  );
  allies.sort((a, b) => Math.abs(a.x - hero.x) - Math.abs(b.x - hero.x));
  const ally = allies[0] ?? null;
  if (ally) chosen.set(lamp, ally);
  return ally;
}

export const wardTarget = (lamp: Enemy): Enemy | undefined => chosen.get(lamp);
