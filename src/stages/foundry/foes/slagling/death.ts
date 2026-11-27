import { GROUND } from "../../../../constants/stage";
import { clampStageX, summonFoe } from "../../../../game/adventure";
import { fxRng, game, particles } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { FORGE_SPARKS } from "../../colors";
import { createSlagPuddle } from "./puddle";
import { isSmall, makeSmall } from "./size";

const SPLIT = { hp: 0.32, xp: 0.2, apart: 7, fling: 70, edge: 10 } as const;
const PUDDLE = { half: 9, damage: 6 } as const;

const burning = (e: Enemy): boolean => e.burn > 0;

function createSplit(parent: Enemy): Effect {
  return {
    update() {
      for (const side of [-1, 1]) {
        const x = clampStageX(parent.x + side * SPLIT.apart, SPLIT.edge);
        const child = summonFoe("slagling", x, GROUND, SPLIT.xp);
        child.max = Math.max(1, Math.round(parent.max * SPLIT.hp));
        child.hp = child.max;
        child.vx = side * SPLIT.fling;
        child.face = side;
        child.cd = 0.9;
        makeSmall(child);
        game.enemies.push(child);
      }
      for (let i = 0; i < 14; i++)
        particles.spawn(
          PK.SPARK,
          parent.x,
          GROUND - 5,
          fxRng.range(-120, 120),
          -fxRng.range(40, 160),
          fxRng.range(0.2, 0.5),
          {
            sparks: FORGE_SPARKS.molten,
          },
        );
      return false;
    },
    draw() {},
  };
}

export function slagTakes(e: Enemy, dmg: number, loud: boolean): number {
  if (Math.max(1, Math.round(dmg)) < e.hp) return dmg;
  const small = isSmall(e);
  game.fx.push(createSlagPuddle(e.x, small ? PUDDLE.half * 0.6 : PUDDLE.half, PUDDLE.damage * e.power));
  if (!small && loud && !burning(e)) game.fx.push(createSplit(e));
  return dmg;
}
