import { hero, ponytail, scarf } from "../state";
import type { HeroLook } from "./drawHero";

/** what the hero sprite needs besides the pose: the ropes in local pixels, the coat flare, whether he holds the sword */
export function heroLook(flare: number): HeroLook {
  const toLocal = (q: { x: number; y: number }): [number, number] => [(q.x - hero.x) * hero.face, q.y - hero.y];
  return { scarf: scarf.points.map(toLocal), tail: ponytail.points.map(toLocal), flare, sword: hero.hasSword };
}
