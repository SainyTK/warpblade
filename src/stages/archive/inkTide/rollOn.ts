import { GROUND } from "../../../constants/stage";
import { drillProfile } from "../../../drill";
import { place } from "../../../engine/frame";
import { stageLeft, stageRight } from "../../../game/adventure";
import { dealDamage } from "../../../game/damage";
import { enemyBox } from "../../../game/enemies/enemy";
import { markFoe } from "../../../game/enemies/skillStatus";
import { game, hero } from "../../../game/state";
import { surfaceBelow } from "../../../game/world";
import type { Effect } from "../../../types/effect";
import type { Enemy } from "../../../types/enemy";
import { clamp } from "../../../utils/math";
import { drawTide } from "./drawTide";
import { TIDE } from "./tide";

export function markWithInk(foe: Enemy, level: number): void {
  markFoe(foe, TIDE.id, TIDE.mark.seconds + level, TIDE.mark.bonus + TIDE.mark.perLevel * level);
}

export function createRollOn(x: number, y: number, level: number): Effect {
  const dir = Math.sign(x - hero.x) || hero.face || 1;
  const reach = TIDE.roll.reach + level * TIDE.roll.perLevel;
  const attack = drillProfile()?.attack ?? 0;
  const damage = attack * TIDE.roll.share * TIDE.damage[level - 1];
  const floor = Math.min(GROUND, surfaceBelow(x, y));
  const spared = new Set<Enemy>(game.enemies.filter((e) => Math.abs(e.x - x) < TIDE.roll.spare));
  const o = { x, travelled: 0, t: 0 };
  return {
    update(dt) {
      o.t += dt;
      const step = TIDE.roll.speed * dt;
      o.x += dir * step;
      o.travelled += step;
      for (const e of game.enemies) {
        if (e.hp <= 0 || spared.has(e)) continue;
        const [left, top, right, bottom] = enemyBox(e);
        if (o.x < left - 3 || o.x > right + 3 || bottom < floor - 26 || top > floor) continue;
        spared.add(e);
        if (damage > 0) dealDamage(e, damage, { fromX: o.x - dir * 8, source: TIDE.id, curls: true });
        markWithInk(e, level);
      }
      return o.travelled < reach && o.x > stageLeft() && o.x < stageRight();
    },
    draw() {
      const k = clamp(o.travelled / reach);
      place(o.x, floor, dir < 0);
      drawTide(TIDE.roll.height * (1 - k * k), o.t * 60, 1 - k * k * k);
      place();
    },
  };
}
