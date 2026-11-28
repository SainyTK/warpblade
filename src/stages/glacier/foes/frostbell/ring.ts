import { ellipseRing, glow, place } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { hero } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { BELL_COLORS } from "./colors";
import { BELL, BELL_HITS } from "./constants";

const HERO_MID = 16;

export const ringRadius = (t: number): number =>
  BELL.ringFrom + (BELL.ringTo - BELL.ringFrom) * clamp(t / BELL.tollActive);

export function createTollRing(e: Enemy): Effect {
  const x = e.x;
  const y = e.y;
  const damage = BELL_HITS.toll * e.power;
  const struck = new Set<number>();
  let t = 0;
  return {
    update(dt) {
      t += dt;
      const r = ringRadius(t);
      eachStanding(() => {
        if (struck.has(heroSlot())) return;
        const d = Math.hypot(hero.x - x, hero.y - HERO_MID - y);
        if (Math.abs(d - r) > BELL.ringBand) return;
        struck.add(heroSlot());
        hurtHero(damage, x);
      });
      return t < BELL.tollActive + 0.15;
    },
    draw() {
      const r = ringRadius(t);
      const fade = 1 - clamp((t - BELL.tollActive) / 0.15);
      place(x, y);
      ellipseRing(0, 0, r, r, BELL_COLORS.ice[4], 0.9 * fade);
      ellipseRing(0, 0, r - 2, r - 2, BELL_COLORS.ice[3], 0.6 * fade);
      ellipseRing(0, 0, r - 4, r - 4, BELL_COLORS.rune[1], 0.35 * fade);
      glow(0, 0, r + 6, BELL_COLORS.ice[3], 0.18 * fade);
      place();
    },
  };
}

export function createTollWarning(e: Enemy, windup: number): Effect {
  let t = 0;
  return {
    update(dt) {
      t += dt;
      return e.state === "wind" && e.hp > 0;
    },
    drawBack() {
      const u = clamp(t / windup);
      place(e.x, e.y);
      ellipseRing(0, 0, BELL.ringTo, BELL.ringTo, BELL_COLORS.rune[u > 0.8 ? 2 : 1], 0.15 + u * 0.45);
      ellipseRing(0, 0, BELL.ringTo * u, BELL.ringTo * u, BELL_COLORS.ice[3], 0.25 + u * 0.3);
      place();
    },
    draw() {},
  };
}
