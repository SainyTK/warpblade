import { PAL, SPARKS } from "../../constants/palette";
import { sfx } from "../../services/audio";
import type { Enemy } from "../../types/enemy";
import { dealDamage } from "../damage";
import { createFloorRing } from "../effects/floorRing";
import { createImpact } from "../effects/impact";
import { game, lights } from "../state";
import { enemyCenter } from "./enemy";

/** a foe that restarts with a lot of speed stored from blows taken while stopped flies no faster than this */
const RESTART_SPEED = 220;

/**
 * Stop a foe in time for `seconds`: it does not move, act or fall, and the damage it takes is stored. When it restarts,
 * `share` of the stored damage lands again as one hit (0 for none). A longer stop already on it is kept.
 */
export function stopFoe(e: Enemy, seconds: number, share: number): void {
  if (e.hp <= 0) return;
  if (e.stopped <= 0) e.stopStore = 0;
  e.stopped = Math.max(e.stopped, seconds);
  e.stopShare = Math.max(e.stopShare, share);
}

/** the damage stored while stopped, taken out: a special that tolls the stored damage itself uses this */
export function takeStored(e: Enemy): number {
  const stored = e.stopStore;
  e.stopStore = 0;
  e.stopShare = 0;
  return stored;
}

/** the stop ran out: the stored share lands as one hit with a toll flash, and the speed it was given carries on */
function restart(e: Enemy): void {
  e.vx = Math.max(-RESTART_SPEED, Math.min(RESTART_SPEED, e.vx));
  const stored = e.stopStore * e.stopShare;
  takeStored(e);
  if (stored < 1) return;
  const [cx, cy] = enemyCenter(e);
  game.fx.push(createImpact(cx, cy, e.face, true, SPARKS.hour));
  game.fx.push(createFloorRing(cx, cy, 14, PAL.hour, 0.3, 0.9));
  lights.add(cx, cy, 30, PAL.hour[4], 0.8, 0.2);
  sfx.hit(true, 0.7);
  dealDamage(e, stored, { fromX: cx, source: "abilities" });
}

/** count a stopped foe's time down; true while it stays stopped, so its own step is skipped */
export function tickStop(e: Enemy, dt: number): boolean {
  if (e.stopped <= 0) return false;
  e.stopped -= dt;
  if (e.stopped > 0) return true;
  e.stopped = 0;
  restart(e);
  return false;
}
