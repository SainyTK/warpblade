import { GROUND } from "../../../../constants/stage";
import { clampStageX, stageThreat } from "../../../../game/adventure";
import { makeEnemy } from "../../../../game/enemies/enemy";
import { fxRng, game, particles } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { FORGE_SPARKS } from "../../colors";

const SPAWN = { most: 4, each: 2, xp: 0.2, fling: 90, edge: 12 } as const;

export const slaglingsAlive = (): number => game.enemies.filter((e) => e.type === "slagling" && e.hp > 0).length;

export function spawnFromAnvil(x: number, dir: number): void {
  const room = Math.min(SPAWN.each, SPAWN.most - slaglingsAlive());
  for (let i = 0; i < room; i++) {
    const side = i % 2 ? dir : -dir;
    const child: Enemy = makeEnemy(
      "slagling",
      clampStageX(x + side * 6, SPAWN.edge),
      GROUND,
      stageThreat(game.wave),
      SPAWN.xp,
    );
    child.vx = side * SPAWN.fling;
    child.face = side;
    child.cd = 1.2;
    game.enemies.push(child);
  }
  for (let i = 0; i < 18; i++)
    particles.spawn(PK.SPARK, x, GROUND - 10, fxRng.range(-120, 120), -fxRng.range(60, 200), fxRng.range(0.3, 0.6), {
      sparks: FORGE_SPARKS.molten,
    });
}
