import { fxRng, game, hero, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { TAU } from "../../../../utils/math";
import { createIceShard } from "../shardling/shard";
import { WRAITH_COLORS } from "./colors";
import { WRAITH, WRAITH_HITS } from "./constants";

export const mouthOf = (e: Enemy): [number, number] => [e.x + e.face * 4, e.y - 6];

export function gatherWail(e: Enemy): void {
  const [mx, my] = mouthOf(e);
  const a = fxRng.range(0, TAU);
  particles.spawn(PK.MOTE, mx + Math.cos(a) * 10, my + Math.sin(a) * 10, -Math.cos(a) * 34, -Math.sin(a) * 34, 0.3, {
    col: WRAITH_COLORS.eye,
    size: 0.6,
  });
}

export function wail(e: Enemy): void {
  const [mx, my] = mouthOf(e);
  const aim = Math.atan2(hero.y - 16 - my, hero.x - mx);
  for (let i = -1; i <= 1; i++)
    game.fx.push(createIceShard(mx, my, aim + i * WRAITH.spread, WRAITH_HITS.shard * e.power, 120));
  sfx.chime(1);
}
