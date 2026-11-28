import { GROUND } from "../../../../constants/stage";
import { clampStageX, summonFoe } from "../../../../game/adventure";
import { createRift } from "../../../../game/effects/rift";
import { kindOf } from "../../../../game/enemies/kinds";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { HUSH_ADD, HUSHWARDEN } from "./moves";

export const hushAddsAlive = (): number => game.enemies.filter((o) => o.type === HUSH_ADD && o.hp > 0).length;

export function callAdds(e: Enemy): void {
  const room = Math.min(HUSHWARDEN.each, HUSHWARDEN.most - hushAddsAlive());
  const rift = kindOf(HUSH_ADD).rift;
  for (let i = 0; i < room; i++) {
    const side = i % 2 ? -1 : 1;
    const x = clampStageX(e.x + side * HUSHWARDEN.spread, 14);
    game.fx.push(
      createRift(x, rift.riftY(GROUND), rift.height, i * 0.2, () => {
        const add = summonFoe(HUSH_ADD, x, GROUND, HUSHWARDEN.xp);
        add.face = side;
        game.enemies.push(add);
      }),
    );
  }
}
