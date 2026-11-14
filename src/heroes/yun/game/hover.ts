import { hero } from "../../../game/state";
import { HOVER, SCREEN } from "../constants/swords";
import { floatPhase } from "./swords";

/** a spirit sword's place in the world: its point and the way it points, radians */
export interface SwordPlace {
  x: number;
  y: number;
  angle: number;
}

/** an angle authored facing right, turned to the way Yun faces */
const faced = (angle: number): number => (hero.face > 0 ? angle : Math.PI - angle);

/** where held sword `i` hovers: behind his shoulders in a fan, points up and forward, bobbing gently */
export function hoverPlace(i: number): SwordPlace {
  const bob = Math.sin(floatPhase() * HOVER.rate + i * 1.3) * HOVER.bob;
  return {
    x: hero.x + hero.face * (HOVER.x + i * HOVER.stepX),
    y: hero.y + HOVER.y + i * HOVER.stepY + bob,
    angle: faced(HOVER.tilt + i * HOVER.tiltStep),
  };
}

/** where held sword `i` of `n` stands while he guards: fanned in front of him, points up, a screen before the jian */
export function screenPlace(i: number, n: number): SwordPlace {
  const u = n > 1 ? i / (n - 1) - 0.5 : 0;
  return {
    x: hero.x + hero.face * (SCREEN.x + Math.abs(u) * -2),
    y: hero.y + SCREEN.y + u * SCREEN.stepY * (n - 1) * 0.9,
    angle: faced(SCREEN.tilt + u * SCREEN.spread * n),
  };
}

/** where held sword `i` of `n` is now: in the screen while he guards, otherwise in the fan behind him */
export const swordPlace = (i: number, n: number): SwordPlace =>
  hero.state === "guard" ? screenPlace(i, n) : hoverPlace(i);
