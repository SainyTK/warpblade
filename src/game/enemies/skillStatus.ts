import type { Enemy, SkillStacks } from "../../types/enemy";
import { coop } from "../coopHooks";
import { dealDamage } from "../damage";

/** how a skill lays stacks: how many at once, the most a foe can carry, a tick's damage per stack, seconds between
 *  ticks and how long the stacks last after the last one was laid */
export interface StackSpec {
  stacks: number;
  max: number;
  damage: number;
  every: number;
  duration: number;
}

/** a mark for the hero in play, so the ticks act as them in a co-op room; null in solo play */
function ownerMark(): object | null {
  const room = coop();
  if (!room) return null;
  const mark = {};
  room.owner(mark);
  return mark;
}

/** the stacks a skill has on a foe, or none */
const entryOf = (e: Enemy, source: string): SkillStacks | undefined => e.stacks.find((s) => s.source === source);

/** lay a skill's stacks on a foe: up to its max, the duration refreshed, the tick damage the newest */
export function addStacks(e: Enemy, source: string, spec: StackSpec): void {
  const entry = entryOf(e, source);
  if (entry) {
    entry.stacks = Math.min(spec.max, entry.stacks + spec.stacks);
    Object.assign(entry, { max: spec.max, damage: spec.damage, every: spec.every, left: spec.duration });
    entry.owner = ownerMark();
    return;
  }
  e.stacks.push({
    source,
    stacks: Math.min(spec.max, spec.stacks),
    max: spec.max,
    damage: spec.damage,
    every: spec.every,
    next: spec.every,
    left: spec.duration,
    owner: ownerMark(),
  });
}

/** how many stacks a skill has on a foe */
export const stacksOf = (e: Enemy, source: string): number => entryOf(e, source)?.stacks ?? 0;

/** take every stack a skill has on a foe away and return how many there were, for a detonation or a consuming strike */
export function consumeStacks(e: Enemy, source: string): number {
  const n = stacksOf(e, source);
  e.stacks = e.stacks.filter((s) => s.source !== source);
  return n;
}

/** mark a foe: for `seconds` it takes `bonus` more damage from every source (0.2 is +20%). Marks of different sources
 *  add together (the sum is capped where damage is dealt); a source's new mark replaces its own when it is longer or
 *  stronger */
export function markFoe(e: Enemy, source: string, seconds: number, bonus: number): void {
  const own = e.marks.find((m) => m.source === source);
  if (!own) {
    e.marks.push({ source, left: seconds, bonus });
    return;
  }
  own.left = Math.max(own.left, seconds);
  own.bonus = Math.max(own.bonus, bonus);
}

/** the extra damage share all of a foe's marks add together, before the cap */
export const markBonus = (e: Enemy): number => e.marks.reduce((sum, m) => sum + m.bonus, 0);

/** stacks tick and run out, and the mark fades; each tick deals its stacks' damage with the skill's id as source */
export function updateSkillStatus(e: Enemy, dt: number): void {
  if (e.marks.length) {
    for (const m of e.marks) m.left -= dt;
    e.marks = e.marks.filter((m) => m.left > 0);
  }
  if (!e.stacks.length) return;
  for (const s of e.stacks) {
    s.left -= dt;
    s.next -= dt;
    if (s.next > 0 || e.hp <= 0) continue;
    s.next += s.every;
    if (s.owner) coop()?.owner(s.owner);
    dealDamage(e, s.damage * s.stacks, { dot: true, source: s.source });
  }
  e.stacks = e.stacks.filter((s) => s.left > 0);
}
