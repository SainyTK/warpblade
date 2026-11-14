/**
 * What happens in Ysra's kit, for the parts that react to another part's action: Heat from glaive blows, her guard and
 * her warp. Each part emits its own events and listens to the others, so no part imports another.
 */
export interface YsraEvents {
  /** a blow of hers landed or missed: a combo move, a counter, a warp's rail, a charge's slam */
  strike: { source: string; hits: number };
  /** a foe's blow was blocked by her guard, or parried in its opening moment */
  block: { fromX: number };
  parry: { fromX: number };
  /** she warped to the haft of her glaive */
  warp: Record<never, never>;
}
type Name = keyof YsraEvents;
type Listener<K extends Name> = (e: YsraEvents[K]) => void;

const listeners: { [K in Name]?: Listener<K>[] } = {};

export function onYsra<K extends Name>(name: K, fn: Listener<K>): void {
  const list = (listeners[name] ?? []) as Listener<K>[];
  list.push(fn);
  (listeners as Record<Name, unknown>)[name] = list;
}

export function emitYsra<K extends Name>(name: K, e: YsraEvents[K]): void {
  for (const fn of (listeners[name] ?? []) as Listener<K>[]) fn(e);
}
