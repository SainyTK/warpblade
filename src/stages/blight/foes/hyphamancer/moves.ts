import { clampStageX } from "../../../../game/adventure";
import { enemyBox } from "../../../../game/enemies/enemy";
import { fxRng, game, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { TAU } from "../../../../utils/math";
import { waveScale } from "../../../../utils/progression";
import { BLIGHT } from "../../colors";
import { createRootEruption } from "../sporeheart/rootEruption";
import { createWardLink, warded } from "../ward";
import { HYPHA, HYPHA_HITS, ROOT_SPREAD } from "./constants";
import { poseOf } from "./pose";

export function staffTop(e: Enemy): [number, number] {
  const p = poseOf(e, game.t + e.seed);
  return [e.x + e.face * p.tip[0], e.y + p.tip[1] - 2];
}

export function gather(e: Enemy, col: number): void {
  const [sx, sy] = staffTop(e);
  const a = fxRng.range(0, TAU);
  particles.spawn(PK.MOTE, sx + Math.cos(a) * 10, sy + Math.sin(a) * 10, -Math.cos(a) * 32, -Math.sin(a) * 32, 0.3, {
    col,
    size: 0.5,
  });
}

function centerOf(e: Enemy): number {
  const [x0, , x1] = enemyBox(e);
  return (x0 + x1) / 2;
}

export function wardTargets(e: Enemy): Enemy[] {
  const near = game.enemies
    .filter((o) => o !== e && o.hp > 0 && o.rank === "minion" && !warded(o))
    .filter((o) => Math.abs(centerOf(o) - e.x) < HYPHA.wardReach)
    .sort((a, b) => Math.abs(a.x - e.x) - Math.abs(b.x - e.x))
    .slice(0, HYPHA.links);
  if (near.length) return near;
  return warded(e) ? [] : [e];
}

export function castWard(e: Enemy): void {
  for (const target of wardTargets(e)) game.fx.push(createWardLink(e, target, () => staffTop(e)));
  e.ay = game.t + HYPHA.wardEvery;
  sfx.chime(0.2);
  const [sx, sy] = staffTop(e);
  for (let i = 0; i < 10; i++) {
    const a = fxRng.range(0, TAU);
    particles.spawn(PK.MOTE, sx, sy, Math.cos(a) * 50, Math.sin(a) * 50, 0.4, {
      col: fxRng.pick([BLIGHT.fungus[3], BLIGHT.fungus[4]]),
      size: 0.6,
    });
  }
}

export function castRoots(e: Enemy, x: number): void {
  const mark = HYPHA.root * waveScale(game.wave).windup;
  const struck = new Set<number>();
  for (const [dx, delay] of ROOT_SPREAD)
    game.fx.push(createRootEruption(clampStageX(x + dx, 8), mark + delay, HYPHA_HITS.root * e.power, struck));
  sfx.swing(0.4);
}
