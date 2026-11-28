import { enemyCenter } from "../../../../game/enemies/enemy";
import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { wardFoe, wardLeft } from "../stormWard";
import { WARD } from "./constants";
import { wardenPose } from "./pose";
import { createWardShell } from "./shell";

export function wardTargets(e: Enemy): Enemy[] {
  return game.enemies
    .filter((o) => o !== e && o.hp > 0 && o.type !== e.type && wardLeft(o) <= 0.5)
    .filter((o) => Math.abs(o.x - e.x) < WARD.range)
    .sort((a, b) => Math.abs(a.x - e.x) - Math.abs(b.x - e.x))
    .slice(0, WARD.most);
}

export function castWard(e: Enemy): Enemy[] {
  const targets = wardTargets(e);
  for (const o of targets) {
    const fresh = wardLeft(o) <= 0;
    wardFoe(o, WARD.last);
    if (fresh) game.fx.push(createWardShell(o));
  }
  return targets;
}

export function lanternPoint(e: Enemy): [number, number] {
  const [tx, ty] = wardenPose(e, game.t + e.seed).tip;
  return [e.x + e.face * (tx + 2.6), e.y + ty + 6];
}

export const threadEnds = (e: Enemy): [number, number][] => wardTargets(e).map((o) => enemyCenter(o));
