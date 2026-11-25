import { usesDrill } from "../../../drill";
import { glow, place, sparkle } from "../../../engine/frame";
import { enemyBox, enemyCenter } from "../../../game/enemies/enemy";
import { objectMemory, rememberPerSeat } from "../../../game/seatMemory";
import { skillValues, withBuild } from "../../../game/skills/query";
import type { Enemy } from "../../../types/enemy";
import { MARK, MARK_LOOK } from "../constants/mark";
import { ROSE_RAMP } from "../look/rose";

/** the foes her Rose mark is on and the seconds left on each; holds foes, so only the host keeps it */
const marks: { list: { foe: Enemy; left: number }[]; t: number } = { list: [], t: 0 };
rememberPerSeat(objectMemory(marks, true));

/** set or refresh the Rose mark on a foe */
function markNumbers(): { time: number; bonus: number; keen: number } {
  if (usesDrill()) return MARK;
  const v = skillValues("ce_markwarp");
  return { time: v.markTime ?? MARK.time, bonus: v.mark ?? MARK.bonus, keen: v.markKeen ?? MARK.keen };
}

export function roseMark(foe: Enemy): void {
  const time = withBuild("duration", markNumbers().time);
  marks.list = [...marks.list.filter((m) => m.foe !== foe), { foe, left: time }];
}

/** the foe carries her Rose mark */
export const isMarked = (foe: Enemy): boolean => marks.list.some((m) => m.foe === foe);

/** the foes she has marked that still stand */
export const markedFoes = (): Enemy[] => marks.list.map((m) => m.foe).filter((e) => e.hp > 0);

/** what her own blow on a marked foe adds: the mark's bonus, more for a Keen blow */
export function markBonus(foe: Enemy, keen: boolean): number {
  if (!isMarked(foe)) return 0;
  const { bonus, keen: keenBonus } = markNumbers();
  return bonus + (keen ? keenBonus : 0);
}

export function tickMarks(dt: number): void {
  marks.t += dt;
  if (!marks.list.length) return;
  marks.list = marks.list.map((m) => ({ foe: m.foe, left: m.left - dt })).filter((m) => m.left > 0 && m.foe.hp > 0);
}

/** a small turning rose sigil over each marked foe */
export function drawMarks(): void {
  if (!marks.list.length) return;
  place();
  for (const m of marks.list) {
    const [x] = enemyCenter(m.foe);
    const y = enemyBox(m.foe)[1] - MARK_LOOK.rise;
    const k = 0.75 + 0.25 * Math.sin(marks.t * MARK_LOOK.spin * 3);
    const fade = Math.min(1, m.left * 2);
    sparkle(x, y, MARK_LOOK.r * k + 1, ROSE_RAMP[4], ROSE_RAMP[6], 0.7 * fade);
    glow(x, y, 7, ROSE_RAMP[3], 0.35 * fade);
  }
}

export function resetMarks(): void {
  marks.list = [];
}
