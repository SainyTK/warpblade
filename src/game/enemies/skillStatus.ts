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

/** mark a foe: for `seconds` it takes `bonus` more damage from every source (0.2 is +20%); the stronger mark wins */
export function markFoe(e: Enemy, seconds: number, bonus: number): void {
  e.mark = Math.max(e.mark, seconds);
  e.markBonus = Math.max(e.markBonus, bonus);
}

/** the damage multiplier a foe's mark gives */
export const markMultiplier = (e: Enemy): number => (e.mark > 0 ? 1 + e.markBonus : 1);

/** stacks tick and run out, and the mark fades; each tick deals its stacks' damage with the skill's id as source */
export function updateSkillStatus(e: Enemy, dt: number): void {
  e.mark = Math.max(0, e.mark - dt);
  if (e.mark <= 0) e.markBonus = 0;
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
