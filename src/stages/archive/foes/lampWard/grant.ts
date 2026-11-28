import { game } from "../../../../game/state";
import type { Enemy } from "../../../../types/enemy";
import { createWardRing } from "./ring";
import { setWard, wardHolds } from "./state";

export function grantWard(ally: Enemy, lamp: Enemy, seconds: number): void {
  const fresh = !wardHolds(ally);
  setWard(ally, lamp, seconds);
  if (fresh) game.fx.push(createWardRing(ally));
}
