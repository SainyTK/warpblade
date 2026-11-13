/**
 * What happens in Ysra's kit, for the parts that react to another part's action: Heat from glaive blows and her guard,
 * fire left by her travel and her warp. Each part emits its own events and listens to the others, so no part imports another.
 */
export interface YsraEvents {
  /** a blow of hers landed or missed: a combo move, a vault crash, a dive impact, a counter, a warp's rail */
  strike: { source: string; hits: number };
  /** a foe's blow was blocked by her guard, or parried in its opening moment */
  block: { fromX: number };
  parry: { fromX: number };
  /** she warped from (x0, y0) to the haft of her glaive at (x, y) */
  warp: { x0: number; y0: number; x: number; y: number };
  /** she landed out of a vault or a dive */
  land: { x: number; y: number; from: "vault" | "dive" };
  /** each frame she travels in a vault, a dive or a charge, where her feet are */
  travel: { x: number; y: number; from: "vault" | "dive" | "charge" };
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
