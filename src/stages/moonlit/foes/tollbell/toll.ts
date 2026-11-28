import { ellipseRing, glow, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { game, hero } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { GRAVE } from "../graveColors";
import { BELL, TOLL, windTime } from "./pose";

const RING = { speed: 190, band: 8 } as const;
const M = GRAVE.moon;

export function createToll(x: number, y: number, reach: number, damage: number): Effect {
  let t = 0;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      const r = t * RING.speed;
      eachStanding(() => {
        if (struck.has(heroSlot()) || hero.state === "dead") return;
        const d = Math.hypot(hero.x - x, hero.y - 14 - y);
        if (d > r + RING.band || d < r - RING.band * 2 || d > reach + 4) return;
        struck.add(heroSlot());
        hurtHero(damage, x);
      });
      return r < reach + 10;
    },
    draw() {
      place();
      const r = Math.min(reach, t * RING.speed);
      const fade = clamp(1 - r / (reach + 10));
      ellipseRing(x, y, r, r, M[3], 0.8 * fade);
      ellipseRing(x, y, r - 2, r - 2, M[2], 0.5 * fade);
      ellipseRing(x, y, r - 5, r - 5, M[1], 0.3 * fade);
      glow(x, y, 18, M[2], 0.5 * clamp(1 - t * 3));
    },
  };
}

export function createTollTell(e: Enemy): Effect {
  return {
    update: () => e.hp > 0 && e.state === "wind" && e.n === TOLL && game.enemies.includes(e),
    draw() {},
    drawBack() {
      place();
      const u = clamp(e.st / windTime(e));
      const pulse = 0.5 + 0.5 * Math.sin(game.t * 14);
      ellipseRing(e.x, e.y + 4, BELL.reach, BELL.reach, M[1], 0.12 + u * 0.3 + pulse * 0.08 * u);
      ellipseRing(e.x, e.y + 4, BELL.reach * u, BELL.reach * u, M[2], 0.15 + u * 0.25);
    },
  };
}
