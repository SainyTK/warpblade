import { glow, place } from "../../../../engine/frame";
import { createGlint } from "../../../../game/effects/flash";
import { game, hero, lights } from "../../../../game/state";
import { INFUSION_HITS } from "../../../../kaelDrill/spells";
import type { Enemy } from "../../../../types/enemy";
import { ROSE_RAMP } from "../../look/rose";
import { roseMark } from "../mark";
import { usesCeriseDrill } from "./selection";

let swingsLeft = 0;
let infusedSwing: number | null = null;

export const ROSE_EDGE = "Rose Edge";

export function resetInfusion(): void {
  swingsLeft = 0;
  infusedSwing = null;
}

export function infuseRapier(): void {
  swingsLeft = INFUSION_HITS;
  infusedSwing = null;
  const x = hero.x + hero.face * hero.hand[0];
  const y = hero.y + hero.hand[1];
  lights.add(x, y, 20, ROSE_RAMP[4], 0.6, 0.25);
  game.fx.push(createGlint(x, y, ROSE_RAMP[5]));
}

export function infuseThrust(foe: Enemy): void {
  if (!usesCeriseDrill()) return;
  if (infusedSwing !== hero.swing) {
    if (!swingsLeft) return;
    swingsLeft--;
    infusedSwing = hero.swing;
  }
  if (foe.hp > 0) roseMark(foe);
}

export function drawInfusion(): void {
  if (!roseEdgeSwings()) return;
  place();
  glow(hero.x + hero.face * hero.hand[0], hero.y + hero.hand[1], 10, ROSE_RAMP[4], 0.4);
}

export const roseEdgeSwings = (): number => (usesCeriseDrill() ? swingsLeft : 0);
