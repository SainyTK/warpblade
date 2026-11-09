import { PAL } from "../../../constants/palette";
import { QUARRY } from "../../../constants/wenna/lamp";
import { glow, place, px } from "../../../engine/frame";
import type { Enemy } from "../../../types/enemy";
import { enemyBox, enemyCenter } from "../../enemies/enemy";
import { emitSkillEvent } from "../../skills/events";
import { skillValues, withCharms } from "../../skills/query";
import { nearestFoe } from "../../skills/targets";
import { game } from "../../state";
import { wennaHost } from "./memory";

/** seconds a Quarry lasts: Hunting Call holds it longer */
const quarryLife = (): number => withCharms("duration", skillValues("w_quarry").life ?? QUARRY.life);

/** how many Quarries she keeps at once */
const quarryCount = (): number => (skillValues("w_quarry").pack ? 99 : (skillValues("w_quarry").count ?? 1));

/** her Quarries still standing */
export const quarries = (): Enemy[] => wennaHost.quarries.map((q) => q.foe).filter((e) => e.hp > 0);

export const isQuarry = (e: Enemy): boolean => wennaHost.quarries.some((q) => q.foe === e);

/** a foe her blow hit becomes her Quarry, newest first; Hunting Call chills it */
export function markQuarry(e: Enemy): void {
  if (e.hp <= 0) return;
  const rest = wennaHost.quarries.filter((q) => q.foe !== e);
  const fresh = !isQuarry(e);
  wennaHost.quarries = [{ foe: e, left: quarryLife() }, ...rest].slice(0, quarryCount());
  if (skillValues("w_quarry").chill) e.chill = Math.max(e.chill, 1);
  if (fresh) emitSkillEvent({ type: "quarry", foe: e });
}

/** Quarries run out; Hunting Call passes a fallen Quarry's mark to the foe nearest it */
export function tickQuarries(dt: number): void {
  const pass = !!skillValues("w_quarry").pass;
  const next: { foe: Enemy; left: number }[] = [];
  for (const q of wennaHost.quarries) {
    q.left -= dt;
    if (q.foe.hp > 0 && q.left > 0) {
      next.push(q);
      continue;
    }
    if (!pass || q.foe.hp > 0) continue;
    const [cx, cy] = enemyCenter(q.foe);
    const heir = nearestFoe(cx, cy, [q.foe, ...next.map((n) => n.foe)]);
    if (heir) next.push({ foe: heir, left: quarryLife() });
  }
  wennaHost.quarries = next;
}

/** a new run or a fall: no Quarry */
export function clearQuarries(): void {
  wennaHost.quarries = [];
}

/** the ring's radius across, how flat it lies, and how far over the foe's head it hangs */
const RING = { radius: 6, flat: 0.45, over: 13 } as const;

/**
 * A ring of violet lamplight over each Quarry's head, turning and pulsing, with a dark rim so it reads against the sky,
 * and a small lamp-violet marker pointing down at the foe.
 */
export function drawQuarries(): void {
  if (!game.enemies.length) return;
  place();
  const t = game.t;
  for (const e of quarries()) {
    const box = enemyBox(e);
    const x = Math.round((box[0] + box[2]) / 2);
    const y = Math.round(box[1]) - RING.over;
    const pulse = 0.5 + 0.5 * Math.sin(t * 8);
    const r = RING.radius + pulse * 0.6;
    const dots = 20;
    for (let i = 0; i < dots; i++) {
      const a = (i / dots) * Math.PI * 2 + t * 2;
      const dx = Math.round(Math.cos(a) * r);
      const dy = Math.round(Math.sin(a) * r * RING.flat);
      px(x + dx, y + dy + 1, PAL.wick[0], 0.8);
    }
    for (let i = 0; i < dots; i++) {
      const a = (i / dots) * Math.PI * 2 + t * 2;
      const c = i % 5 === 0 ? PAL.wick[5] : PAL.wick[3];
      px(x + Math.round(Math.cos(a) * r), y + Math.round(Math.sin(a) * r * RING.flat), c);
    }
    // a small chevron under the ring, pointing at the foe
    for (const [dx, dy] of [
      [-1, 3],
      [0, 4],
      [1, 3],
    ] as const) {
      px(x + dx, y + dy + 1, PAL.wick[0], 0.8);
      px(x + dx, y + dy, PAL.wick[4]);
    }
    glow(x, y, 9, PAL.wick[4], 0.25 + pulse * 0.15);
  }
}
