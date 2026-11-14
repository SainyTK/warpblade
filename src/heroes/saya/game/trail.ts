import { hairline, line, place } from "../../../engine/frame";
import { dealDamage } from "../../../game/damage";
import { enemyBox, enemyCenter } from "../../../game/enemies/enemy";
import { skin } from "../../../game/hero/skin";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { skillLevel, skillValues, withCharms } from "../../../game/skills/query";
import { foesOnScreen } from "../../../game/skills/targets";
import { hero, progress } from "../../../game/state";
import type { Enemy } from "../../../types/enemy";
import { WHITE } from "../../../utils/color";
import { clamp } from "../../../utils/math";
import { TRAIL } from "../constants/skillLook";
import { SKILL } from "../constants/skills/ids";
import { STORE_ANGLE } from "./moves/slashes";
import { storeCut } from "./store";

/** one ink trail on the floor: its ends, its floor, the seconds it has left and how long it was laid for */
interface Trail {
  x0: number;
  x1: number;
  y: number;
  left: number;
  life: number;
  next: number;
}

/** Lingering Line's trails, ticking on the foes in them. Effects of the host, so the host keeps them */
const trails: { list: Trail[] } = { list: [] };
rememberPerSeat(objectMemory(trails, true));

/** lay a trail between two points of the floor, when Lingering Line is held */
export function layTrail(x0: number, x1: number, y: number): void {
  const v = skillValues(SKILL.trail);
  if (!v.time) return;
  const life = withCharms("duration", v.time);
  const [a, b] = x0 < x1 ? [x0, x1] : [x1, x0];
  trails.list = [...trails.list, { x0: a, x1: b, y, left: life, life, next: 0 }];
}

/** half the trail's height: foes whose box reaches this close to its floor stand in it */
const half = (): number => TRAIL.half * (skillValues(SKILL.trail).wide ?? 1);

/** a foe stands in a trail */
function inTrail(e: Enemy, t: Trail): boolean {
  const [x0, y0, x1, y1] = enemyBox(e);
  return x1 > t.x0 && x0 < t.x1 && y1 > t.y - half() && y0 < t.y + half();
}

/** the foes standing in any trail now */
export const foesOnTrails = (): Enemy[] => foesOnScreen().filter((e) => trails.list.some((t) => inTrail(e, t)));

/** she stands on one of her own trails */
export const onOwnTrail = (x: number): boolean =>
  trails.list.some((t) => x >= t.x0 && x <= t.x1 && Math.abs(hero.y - t.y) < half());

/** trails run down and tick on the foes in them: ink damage, a slow, and a small stored cut at the eighth level */
export function tickTrails(dt: number): void {
  if (!trails.list.length) return;
  const v = skillValues(SKILL.trail);
  const ap = progress.stats.ap;
  for (const t of trails.list) {
    t.left -= dt;
    t.next -= dt;
    if (t.next > 0 || !skillLevel(SKILL.trail)) continue;
    t.next = v.every;
    for (const e of foesOnScreen()) {
      if (!inTrail(e, t)) continue;
      dealDamage(e, ap * v.damage, { dot: true, source: SKILL.trail });
      if (v.slow) e.chill = Math.max(e.chill, v.every + 0.1);
      if (v.store) storeCut(e, ap * v.store, STORE_ANGLE.line);
    }
  }
  trails.list = trails.list.filter((t) => t.left > 0);
}

/** the trails on the floor: a band of ink with a white edge on top, drying from the ends and breaking up as it goes */
export function drawTrails(): void {
  if (!trails.list.length) return;
  place();
  const ramp = skin.ramp;
  const h = half() * 0.35;
  for (const t of trails.list) {
    const u = 1 - clamp(t.left / t.life);
    const span = t.x1 - t.x0;
    const a = t.x0 + span * u * 0.3;
    const b = t.x1 - span * u * 0.3;
    for (let x = a; x < b; x += 1) {
      if (u > 0.5 && Math.floor(x * 3 + t.left * 8) % 5 === 0) continue;
      line(x, t.y - h, x, t.y, ramp[1], 0.85);
    }
    hairline(a, t.y - h - 0.5, b, t.y - h - 0.5, WHITE, 0.7 * (1 - u));
  }
}

/** foes on a trail, with their middles, for Ink Sea's burst */
export const trailCenters = (): [Enemy, number, number][] => foesOnTrails().map((e) => [e, ...enemyCenter(e)]);

/** a fresh run: no trails */
export function resetTrails(): void {
  trails.list = [];
}
