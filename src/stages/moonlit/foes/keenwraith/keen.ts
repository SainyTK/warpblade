import { glow, hairline, place, px } from "../../../../engine/frame";
import { eachStanding, heroSlot } from "../../../../game/coopHooks";
import { hurtHero } from "../../../../game/hurtHero";
import { shotWarded } from "../../../../game/shotWards";
import { game, hero } from "../../../../game/state";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { clamp } from "../../../../utils/math";
import { GRAVE } from "../graveColors";
import { drawTime, mouthAt } from "./pose";

const KEEN = { speed: 150, reach: 120, half: 0.42, band: 7, rings: 3, gap: 9 } as const;
const V = GRAVE.veil;

function arc(x: number, y: number, aim: number, r: number, a: number, c: number): void {
  const step = 0.8 / Math.max(r, 1);
  for (let t = -KEEN.half; t <= KEEN.half; t += step) {
    const edge = 1 - Math.abs(t) / KEEN.half;
    px(x + Math.cos(aim + t) * r, y + Math.sin(aim + t) * r, c, a * (0.35 + 0.65 * edge));
  }
}

export function createKeen(x: number, y: number, aim: number, damage: number): Effect {
  let t = 0;
  const struck = new Set<number>();
  return {
    update(dt) {
      t += dt;
      const front = t * KEEN.speed;
      if (shotWarded(x + Math.cos(aim) * front, y + Math.sin(aim) * front)) return false;
      eachStanding(() => {
        if (struck.has(heroSlot()) || hero.state === "dead") return;
        const dx = hero.x - x;
        const dy = hero.y - 16 - y;
        const dist = Math.hypot(dx, dy);
        let off = Math.atan2(dy, dx) - aim;
        while (off > Math.PI) off -= Math.PI * 2;
        while (off < -Math.PI) off += Math.PI * 2;
        const inBand = dist < front + KEEN.band && dist > front - KEEN.band - KEEN.gap * (KEEN.rings - 1);
        if (!inBand || Math.abs(off) > KEEN.half + 6 / Math.max(dist, 1)) return;
        struck.add(heroSlot());
        hurtHero(damage, x);
      });
      return front < KEEN.reach + KEEN.gap * KEEN.rings;
    },
    draw() {
      place();
      const front = t * KEEN.speed;
      for (let k = 0; k < KEEN.rings; k++) {
        const r = front - k * KEEN.gap;
        if (r < 2 || r > KEEN.reach) continue;
        const fade = clamp(1 - r / KEEN.reach) * (1 - k * 0.25);
        arc(x, y, aim, r, fade, k === 0 ? V[3] : V[2]);
        arc(x, y, aim, r - 1.5, fade * 0.6, V[1]);
      }
      glow(x, y, 14, V[1], 0.4 * clamp(1 - t * 2));
    },
  };
}

export function createKeenTell(e: Enemy): Effect {
  return {
    update: () => e.hp > 0 && e.state === "wind" && game.enemies.includes(e),
    drawBack() {
      place();
      const u = clamp(e.st / drawTime());
      const [mx, my] = mouthAt(e);
      const aim = e.ax;
      const a = 0.12 + u * 0.4;
      for (const side of [-1, 1]) {
        const dir = aim + side * KEEN.half;
        hairline(mx, my, mx + Math.cos(dir) * KEEN.reach * 0.8, my + Math.sin(dir) * KEEN.reach * 0.8, V[1], a);
      }
      const r = KEEN.reach * (1 - u) + 6;
      arc(mx, my, aim, r, 0.25 + u * 0.5, V[2]);
    },
    draw() {
      const u = clamp(e.st / drawTime());
      const [mx, my] = mouthAt(e);
      glow(mx, my, 6 + u * 14, V[2], 0.2 + u * 0.5);
    },
  };
}
