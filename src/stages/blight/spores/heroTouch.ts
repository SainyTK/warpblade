import { eachStanding, heroSlot } from "../../../game/coopHooks";
import { heroGuarded } from "../../../game/hero/guard";
import { hurtHero } from "../../../game/hurtHero";
import { game, hero } from "../../../game/state";
import { boxHit, heroBox } from "../../../game/world";
import type { Box } from "../../../types/world";

export interface Exposure {
  inside: Map<number, number>;
  grace: number;
}

export const exposure = (grace: number): Exposure => ({ inside: new Map(), grace });

export function circleTouchesHero(x: number, y: number, r: number): boolean {
  const [x0, y0, x1, y1] = heroBox();
  const nx = Math.max(x0, Math.min(x, x1));
  const ny = Math.max(y0, Math.min(y, y1));
  return (nx - x) ** 2 + ((ny - y) * 1.3) ** 2 < r * r;
}

export function linger(state: Exposure, dt: number, touches: () => boolean, damage: number, fromX: number): void {
  eachStanding(() => {
    const slot = heroSlot();
    if (game.mode !== "play" || !touches()) {
      state.inside.delete(slot);
      return;
    }
    const held = (state.inside.get(slot) ?? 0) + dt;
    state.inside.set(slot, held);
    if (held < state.grace || hero.inv > 0 || heroGuarded()) return;
    state.inside.set(slot, 0);
    hurtHero(damage, fromX);
  });
}

export function strikeOnce(struck: Set<number>, area: Box, damage: number, fromX: number): void {
  eachStanding(() => {
    const slot = heroSlot();
    if (struck.has(slot) || !boxHit(area, heroBox())) return;
    struck.add(slot);
    hurtHero(damage, fromX);
  });
}
