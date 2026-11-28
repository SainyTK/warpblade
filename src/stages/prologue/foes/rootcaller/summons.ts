import { GROUND } from "../../../../constants/stage";
import { clampStageX, summonFoe } from "../../../../game/adventure";
import { createRift } from "../../../../game/effects/rift";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { ROOTCALLER, SUMMONS } from "./constants";

const called = new WeakMap<Enemy, Enemy[]>();
const nextCall = new WeakMap<Enemy, number>();

export const liveSummons = (e: Enemy): number => (called.get(e) ?? []).filter((s) => s.hp > 0).length;

export const mayCall = (e: Enemy): boolean => liveSummons(e) < SUMMONS.each && game.t >= (nextCall.get(e) ?? 0);

export function callSlimes(e: Enemy): void {
  const alive = (called.get(e) ?? []).filter((s) => s.hp > 0);
  const room = Math.min(SUMMONS.each, SUMMONS.most - alive.length);
  nextCall.set(e, game.t + ROOTCALLER.callEvery);
  for (let i = 0; i < room; i++) {
    const side = i % 2 ? 1 : -1;
    const x = clampStageX(e.x + e.face * 14 + side * 12, SUMMONS.edge);
    game.fx.push(
      createRift(x, GROUND - 6, 8, i * 0.15, () => {
        const slime = summonFoe("slime", x, GROUND, SUMMONS.xp);
        slime.face = e.face;
        slime.vx = side * SUMMONS.fling;
        slime.cd = 1;
        game.enemies.push(slime);
        alive.push(slime);
      }),
    );
  }
  called.set(e, alive);
}
