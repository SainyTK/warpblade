import { clampStageX, summonFoe } from "../../../../game/adventure";
import { fxRng, game, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { SKY_SPARKS } from "../colors";
import { CALL } from "./constants";

const CALLED = "squallfinch";

export const calledAlive = (): number => game.enemies.filter((o) => o.type === CALLED && o.hp > 0).length;

export function callFinches(e: Enemy): void {
  const room = Math.min(CALL.most, CALL.most + 1 - calledAlive());
  for (let i = 0; i < room; i++) {
    const side = i % 2 ? 1 : -1;
    const x = clampStageX(e.x + side * 18, 10);
    const child = summonFoe(CALLED, x, e.y - 52, 0.15);
    child.vy = -40;
    child.side = side;
    child.cd = 1.4;
    game.enemies.push(child);
    for (let k = 0; k < 8; k++)
      particles.spawn(PK.SPARK, x, e.y - 52, fxRng.range(-60, 60), fxRng.range(-60, 60), 0.3, {
        sparks: SKY_SPARKS.volt,
      });
  }
  sfx.thunder();
}
