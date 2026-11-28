import { GROUND } from "../../../../constants/stage";
import { clampStageX, summonFoe } from "../../../../game/adventure";
import { createRift } from "../../../../game/effects/rift";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { umbramite } from "../umbramite/kind";
import { HEADSMAN } from "./constants";

const callers = new WeakMap<Enemy, Enemy>();

export const calledAlive = (by: Enemy): number => game.enemies.filter((o) => o.hp > 0 && callers.get(o) === by).length;

export function callMites(e: Enemy): void {
  const room = HEADSMAN.callMost - calledAlive(e);
  const rift = umbramite.rift;
  for (let i = 0; i < room; i++) {
    const x = clampStageX(e.x + (i % 2 ? -1 : 1) * (26 + i * 10), 12);
    game.fx.push(
      createRift(x, rift.riftY(GROUND), rift.height, i * 0.15, () => {
        const mite = summonFoe("umbramite", x, GROUND, HEADSMAN.callXp);
        callers.set(mite, e);
        mite.cd = 1;
        game.enemies.push(mite);
      }),
    );
  }
}
