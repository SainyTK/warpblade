import { ellipseRing, fleck, glow, place } from "../../../../engine/frame";
import { enemyBox, enemyCenter } from "../../../../game/enemies/enemy";
import { RAIN_FOES as R, WATER_SPARKS } from "../../../../game/enemies/rain/colors";
import { fxRng, particles } from "../../../../game/state";
import { sfx } from "../../../../services/audio";
import type { Effect } from "../../../../types/effect";
import type { Enemy } from "../../../../types/enemy";
import { PK } from "../../../../types/particle";
import { clamp } from "../../../../utils/math";
import { WARD } from "./constants";
import { markWarded } from "./wardTarget";

const DROPS = 5;

function burst(ally: Enemy): void {
  const [cx, cy] = enemyCenter(ally);
  for (let i = 0; i < 16; i++) {
    const a = fxRng.range(0, Math.PI * 2);
    particles.spawn(
      PK.SPARK,
      cx + Math.cos(a) * 12,
      cy + Math.sin(a) * 10,
      Math.cos(a) * 70,
      Math.sin(a) * 50 - 30,
      0.4,
      {
        sparks: WATER_SPARKS,
      },
    );
  }
  sfx.shatter();
}

export function createRainWard(ally: Enemy): Effect {
  const full = Math.max(1, ally.max * WARD.share);
  let pool = full;
  let last = ally.hp;
  let t = 0;
  let ripple = 0;
  markWarded(ally, true);
  const end = (popped: boolean): boolean => {
    markWarded(ally, false);
    if (popped) burst(ally);
    return false;
  };
  return {
    update(dt) {
      t += dt;
      ripple = Math.max(0, ripple - dt * 3);
      if (ally.hp <= 0) return end(false);
      const lost = last - ally.hp;
      if (lost > 0) {
        const give = Math.min(lost, pool);
        ally.hp += give;
        pool -= give;
        ripple = 1;
      }
      last = ally.hp;
      if (pool <= 0) return end(true);
      if (t >= WARD.life) return end(true);
      return true;
    },
    draw() {
      const [cx, cy] = enemyCenter(ally);
      const box = enemyBox(ally);
      const rx = (box[2] - box[0]) / 2 + 6;
      const ry = (box[3] - box[1]) / 2 + 5;
      const strength = 0.35 + 0.65 * (pool / full);
      const grow = clamp(t / 0.25);
      const fade = clamp((WARD.life - t) / 0.4);
      const k = grow * fade;
      const wob = Math.sin(t * 9) * 0.8;
      place();
      glow(cx, cy, rx + 6, R.wart, 0.12 * k * strength + ripple * 0.2);
      ellipseRing(cx, cy, (rx + wob) * grow, (ry - wob) * grow, R.water, 0.75 * k * strength);
      ellipseRing(cx, cy, (rx - 1.5 + wob) * grow, (ry - 1.5 - wob) * grow, R.wart, 0.3 * k * strength);
      if (ripple > 0) ellipseRing(cx, cy, rx + (1 - ripple) * 6, ry + (1 - ripple) * 5, R.veinHot, ripple * k);
      for (let i = 0; i < DROPS; i++) {
        const a = Math.PI * (1.15 + ((t * 0.45 + i / DROPS) % 1) * 0.7);
        fleck(cx + Math.cos(a) * rx * grow, cy - Math.abs(Math.sin(a)) * ry * grow, R.wetSky, k);
      }
      fleck(cx - rx * 0.5, cy - ry * 0.7, R.kiteGlint, 0.9 * k);
    },
  };
}
