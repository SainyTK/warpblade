import { clampStageX, summonFoe } from "../../../../game/adventure";
import { createRift } from "../../../../game/effects/rift";
import { kindOf } from "../../../../game/enemies/kinds";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PUFF_ROOM } from "./timing";

const SPAWN = { side: 26, drop: 10, xp: 0.2, edge: 20 } as const;
const broods = new WeakMap<Enemy, Enemy[]>();

export function puffsAlive(e: Enemy): number {
  const brood = (broods.get(e) ?? []).filter((puff) => puff.hp > 0 && game.enemies.includes(puff));
  broods.set(e, brood);
  return brood.length;
}

export const roomForPuffs = (e: Enemy): boolean => puffsAlive(e) < PUFF_ROOM;

export function shakeLoosePuffs(e: Enemy): void {
  const rift = kindOf("sporepuff").rift;
  const room = PUFF_ROOM - puffsAlive(e);
  for (let i = 0; i < room; i++) {
    const side = i === 0 ? -1 : 1;
    const x = clampStageX(e.x + side * SPAWN.side, SPAWN.edge);
    const y = e.y + SPAWN.drop;
    game.fx.push(
      createRift(x, rift.riftY(y), rift.height, i * 0.15, () => {
        const puff = summonFoe("sporepuff", x, y, SPAWN.xp);
        broods.get(e)?.push(puff);
        game.enemies.push(puff);
      }),
    );
  }
}
